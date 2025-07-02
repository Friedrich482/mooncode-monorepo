import {
  DayFilesStatsDtoType,
  GetProjectFilesOnPeriodDtoType,
  GetProjectLanguagesPerDayOfPeriodDtoType,
  GetProjectLanguagesTimeOnPeriodType,
  GetProjectOnPeriodDtoType,
  GetProjectPerDayOfPeriodDtoType,
  UpsertFilesStatsDtoType,
} from "./files-stats.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { DatesDtoType } from "src/common/dto";
import { FilesService } from "src/files/files.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import { ProjectsService } from "src/projects/projects.service";
import formatDuration from "@repo/utils/formatDuration";
import getProjectLanguageGroupByMonths from "./utils/getProjectLanguageGroupByMonths";
import getProjectLanguagesGroupByWeeks from "./utils/getProjectLanguagesGroupByWeeks";
import getProjectPerDayOfPeriodGroupByMonths from "./utils/getProjectPerDayOfPeriodGroupByMonths";
import getProjectPerDayOfPeriodGroupByWeeks from "./utils/getProjectPerDayOfPeriodGroupByWeeks";

@Injectable()
export class FilesStatsService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly filesService: FilesService,
    private readonly dailyDataService: DailyDataService,
    private readonly languagesService: LanguagesService,
  ) {}
  async getDailyFilesStatsForExtension({
    userId,
    dayFilesStatsDto,
  }: {
    userId: string;
    dayFilesStatsDto: DayFilesStatsDtoType;
  }) {
    const { dateString } = dayFilesStatsDto;

    const dayData = await this.dailyDataService.findOneDailyData({
      userId,
      date: dateString,
    });

    if (!dayData) {
      return {};
    }

    const filesData = await this.filesService.findAllFilesOnDay({
      dailyDataId: dayData.id,
    });

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
    const dailyDataForDay = await this.dailyDataService.findOneDailyData({
      userId,
      date: targetedDate,
    });

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

      const existingProject = await this.projectsService.findOneProject({
        dailyDataId: dailyDataForDay.id,
        name: file.projectName,
        path: file.projectPath,
      });

      if (!existingProject) {
        // if the project doesn't exist, let's create it
        const createdProject = await this.projectsService.createProject({
          dailyDataId: dailyDataForDay.id,
          name: file.projectName,
          path: file.projectPath,
          timeSpent: timeSpentPerProject[file.projectPath],
        });

        returningProjectData.projectId = createdProject.id;
        returningProjectData.projectName = createdProject.name;
        returningProjectData.timeSpent = createdProject.timeSpent;
      } else {
        // else update it but only if the new time spent is greater than the existing one
        if (
          existingProject.timeSpent <= timeSpentPerProject[file.projectPath]
        ) {
          await this.projectsService.updateProject({
            dailyDataId: dailyDataForDay.id,
            name: file.projectName,
            path: file.projectPath,
            timeSpent: timeSpentPerProject[file.projectPath],
          });
        }

        returningProjectData.projectId = existingProject.id;
        returningProjectData.projectName = existingProject.name;
        returningProjectData.timeSpent = existingProject.timeSpent;
      }

      const fileLanguage = await this.languagesService.findOneLanguage({
        dailyDataId: dailyDataForDay.id,
        languageSlug: file.languageSlug,
      });

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
        // else just update the file data but only if the new timeSpent is greater than the existing one
        if (existingFileData.timeSpent <= file.timeSpent) {
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
  }

  async getPeriodProjects({ userId, start, end }: DatesDtoType) {
    const projectsOnRange = await this.projectsService.findAllRangeProjects({
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
    const project = await this.projectsService.groupAndAggregateProjectByName({
      start,
      end,
      userId,
      name,
    });

    return project;
  }

  async getProjectPerDayOfPeriod({
    userId,
    start,
    end,
    name,
    groupBy,
    periodResolution,
  }: GetProjectPerDayOfPeriodDtoType) {
    const dailyProjectsForPeriod =
      await this.projectsService.findProjectByNameOnRange({
        userId,
        start,
        end,
        name,
      });

    if (dailyProjectsForPeriod.length === 0) return [];

    switch (groupBy) {
      case "weeks":
        return getProjectPerDayOfPeriodGroupByWeeks(
          dailyProjectsForPeriod,
          periodResolution,
        );

      case "months":
        return getProjectPerDayOfPeriodGroupByMonths(dailyProjectsForPeriod);

      default:
        break;
    }

    return dailyProjectsForPeriod.map(({ timeSpent, date }) => ({
      timeSpentLine: timeSpent,
      timeSpentBar: timeSpent,
      timeSpentArea: timeSpent,
      value: formatDuration(timeSpent),
      originalDate: new Date(date).toDateString(),
      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
    }));
  }

  async getProjectLanguagesTimeOnPeriod({
    userId,
    start,
    end,
    name,
    periodResolution,
  }: GetProjectLanguagesTimeOnPeriodType) {
    const dailyProjectsForPeriod =
      await this.projectsService.findProjectByNameOnRange({
        userId,
        start,
        end,
        name,
      });

    if (dailyProjectsForPeriod.length === 0) return [];

    const totalTimeSpentOnProjectOnPeriod = (
      await this.getProjectOnPeriod({
        userId,
        start,
        end,
        name,
        periodResolution,
      })
    ).totalTimeSpent;

    const aggregatedLanguageTime =
      await this.projectsService.getLanguagesTimeOnPeriod({
        userId,
        start,
        end,
        name,
      });

    return Object.entries(aggregatedLanguageTime)
      .map(([languageSlug, timeSpent]) => ({
        languageSlug,
        time: timeSpent,
        value: formatDuration(timeSpent),
        percentage:
          totalTimeSpentOnProjectOnPeriod === 0
            ? 0
            : parseFloat(
                ((timeSpent * 100) / totalTimeSpentOnProjectOnPeriod).toFixed(
                  2,
                ),
              ),
      }))
      .sort((a, b) => a.time - b.time);
  }

  async getProjectLanguagesPerDayOfPeriod({
    userId,
    start,
    end,
    name,
    groupBy,
    periodResolution,
  }: GetProjectLanguagesPerDayOfPeriodDtoType) {
    const dailyProjectsForPeriod =
      await this.projectsService.findProjectByNameOnRange({
        userId,
        start,
        end,
        name,
      });

    if (dailyProjectsForPeriod.length === 0) return [];

    const languagesTimesPerDayOfPeriod =
      await this.projectsService.getLanguagesTimePerDayOfPeriod({
        userId,
        start,
        end,
        name,
      });

    switch (groupBy) {
      case "weeks":
        return await getProjectLanguagesGroupByWeeks(
          dailyProjectsForPeriod,
          periodResolution,
          languagesTimesPerDayOfPeriod,
        );

      case "months":
        return getProjectLanguageGroupByMonths(
          dailyProjectsForPeriod,
          languagesTimesPerDayOfPeriod,
        );

      default:
        break;
    }

    return dailyProjectsForPeriod.map(({ timeSpent, date }) => ({
      timeSpent,
      originalDate: new Date(date).toDateString(),
      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      ...(languagesTimesPerDayOfPeriod[date] ?? {}),
    }));
  }

  async getProjectFilesOnPeriod({
    userId,
    start,
    end,
    name,
    amount,
    languages,
  }: GetProjectFilesOnPeriodDtoType) {
    const data = await this.projectsService.getAllProjectFilesOnPeriod({
      userId,
      start,
      end,
      name,
      amount,
      languages,
    });

    return data;
  }
}
