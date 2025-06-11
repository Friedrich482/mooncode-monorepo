import {
  DayFilesStatsDtoType,
  UpsertFilesStatsDtoType,
} from "./files-stats.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
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
    dateString,
  }: DayFilesStatsDtoType) {
    const dayData = await this.dailyDataService.findOneDailyData(userId, {
      date: dateString,
    });

    if (!dayData) {
      return {};
    }

    const filesData = await this.filesService.findAllFiles(dayData.id);
    return filesData;
  }

  async upsert({
    userId,
    upsertFilesDto,
  }: {
    userId: string;
    upsertFilesDto: UpsertFilesStatsDtoType;
  }) {
    const { data, targetedDate } = upsertFilesDto;

    const dailyDataForDay = await this.dailyDataService.findOneDailyData(
      userId,
      { date: targetedDate },
    );

    if (!dailyDataForDay) {
      // early exit – nothing to upsert
      return;
    }

    for (const [path, file] of Object.entries(data)) {
      const fileName = path.split("/").pop()!;
      const returningProjectData = {
        projectId: "",
        projectName: "",
      };

      const existingProject = await this.projectService.findOneProject({
        userId,
        projectName: file.projectName,
        path: file.projectPath,
      });

      if (!existingProject) {
        // if the project for the file doesn't exist, let's create it
        const createdProject = await this.projectService.createProject({
          projectName: file.projectName,
          path: file.projectPath,
          userId,
        });

        returningProjectData.projectId = createdProject.id;
        returningProjectData.projectName = createdProject.projectName;
      } else {
        returningProjectData.projectId = existingProject.id;
        returningProjectData.projectName = existingProject.projectName;
      }

      const existingFileData = await this.filesService.findOneFile({
        dailyDataId: dailyDataForDay.id,
        projectId: returningProjectData.projectId,
        fileName,
        path,
      });

      const fileLanguage = await this.languageService.findOneLanguage(
        dailyDataForDay.id,
        file.language,
      );

      // must exist too at this point
      if (!fileLanguage) {
        continue;
      }

      if (!existingFileData) {
        // if the data for this file doesn't exist, create one
        await this.filesService.createFile({
          projectId: returningProjectData.projectId,
          dailyDataId: dailyDataForDay.id,
          languageId: fileLanguage.languageId,
          fileName,
          path: path,
          timeSpent: file.timeSpent,
        });
      } else {
        // else just update the file data
        await this.filesService.updateFile({
          projectId: returningProjectData.projectId,
          dailyDataId: dailyDataForDay.id,
          languageId: fileLanguage.languageId,
          path: path,
          timeSpent: file.timeSpent,
          fileName,
        });
      }
    }
  }
}
