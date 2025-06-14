import {
  DayFilesStatsDtoType,
  GetProjectOnPeriodDtoType,
  UpsertFilesStatsDtoType,
} from "./files-stats.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { DatesDtoType } from "src/common/dto";
import { FilesService } from "src/files/files.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import { ProjectsService } from "src/projects/projects.service";

@Injectable()
export class FilesStatsService {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly filesService: FilesService,
    private readonly dailyDataService: DailyDataService,
    private readonly languageService: LanguagesService,
  ) {}
  async getDailyFilesStatsForExtension({
    userId,
    dayFilesStatsDto,
  }: {
    userId: string;
    dayFilesStatsDto: DayFilesStatsDtoType;
  }) {
    const { dateString } = dayFilesStatsDto;

    const dayData = await this.dailyDataService.findOneDailyData(userId, {
      date: dateString,
    });

    if (!dayData) {
      return {};
    }

    const filesData = await this.filesService.findAllFilesOnDay(dayData.id);
    return filesData;
  }

  async upsert({
    userId,
    upsertFilesDto,
  }: {
    userId: string;
    upsertFilesDto: UpsertFilesStatsDtoType;
  }) {
    const { filesData, timeSpentPerProject, targetedDate } = upsertFilesDto;
    const dailyDataForDay = await this.dailyDataService.findOneDailyData(
      userId,
      { date: targetedDate },
    );

    if (!dailyDataForDay) {
      // early exit – nothing to upsert
      return;
    }

    for (const [path, file] of Object.entries(filesData)) {
      const fileName = path.split("/").pop()!;

      const returningProjectData = {
        projectId: "",
        projectName: "",
        timeSpent: 0,
      };

      const existingProject = await this.projectService.findOneProject({
        dailyDataId: dailyDataForDay.id,
        name: file.projectName,
        path: file.projectPath,
      });

      if (!existingProject) {
        // if the project doesn't exist, let's create it
        const createdProject = await this.projectService.createProject({
          dailyDataId: dailyDataForDay.id,
          name: file.projectName,
          path: file.projectPath,
          timeSpent: timeSpentPerProject[file.projectPath],
        });

        returningProjectData.projectId = createdProject.id;
        returningProjectData.projectName = createdProject.name;
        returningProjectData.timeSpent = createdProject.timeSpent;
      } else {
        // else update it
        await this.projectService.updateProject({
          dailyDataId: dailyDataForDay.id,
          name: file.projectName,
          path: file.projectPath,
          timeSpent: timeSpentPerProject[file.projectPath],
        });

        returningProjectData.projectId = existingProject.id;
        returningProjectData.projectName = existingProject.name;
        returningProjectData.timeSpent = existingProject.timeSpent;
      }

      const fileLanguage = await this.languageService.findOneLanguage(
        dailyDataForDay.id,
        file.language,
      );

      // must exist too at this point
      if (!fileLanguage) {
        continue;
      }

      const existingFileData = await this.filesService.findOneFile({
        projectId: returningProjectData.projectId,
        name: fileName,
        path,
        languageId: fileLanguage.languageId,
      });

      if (!existingFileData) {
        // if the data for this file doesn't exist, create one
        await this.filesService.createFile({
          projectId: returningProjectData.projectId,
          languageId: fileLanguage.languageId,
          name: fileName,
          path,
          timeSpent: file.timeSpent,
        });
      } else {
        // else just update the file data
        await this.filesService.updateFile({
          projectId: returningProjectData.projectId,
          languageId: fileLanguage.languageId,
          path,
          timeSpent: file.timeSpent,
          name: fileName,
        });
      }
    }
  }

  async getPeriodProjects({ userId, start, end }: DatesDtoType) {
    const projectsOnRange = await this.projectService.findAllRangeProjects({
      userId,
      start,
      end,
    });

    const timeSpentAcrossAllProjects = projectsOnRange.reduce(
      (acc, value) => acc + value.totalTimeSpent,
      0,
    );

    const finalData = projectsOnRange.map((project) => ({
      ...project,
      percentage:
        timeSpentAcrossAllProjects === 0
          ? 0
          : parseFloat(
              (
                (project.totalTimeSpent * 100) /
                timeSpentAcrossAllProjects
              ).toFixed(2),
            ),
    }));

    return finalData;
  }

  async getProjectOnPeriod({
    userId,
    start,
    end,
    name,
  }: GetProjectOnPeriodDtoType) {
    const project = await this.projectService.groupAndAggregateProjectByName({
      start,
      end,
      userId,
      name,
    });

    return project;
  }
}
