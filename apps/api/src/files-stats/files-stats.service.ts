import { DailyDataService } from "src/daily-data/daily-data.service";
import { FilesService } from "src/files/files.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import { ProjectsService } from "src/projects/projects.service";
import { UpsertFilesStatsDtoType } from "./files-stats.dto";

@Injectable()
export class FilesStatsService {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly filesService: FilesService,
    private readonly dailyDataService: DailyDataService,
    private readonly languageService: LanguagesService,
  ) {}
  async getFilesStatsForExtension({}) {}

  async upsert({
    userId,
    upsertFilesDto,
  }: {
    userId: string;
    upsertFilesDto: UpsertFilesStatsDtoType;
  }) {
    for (const [path, file] of Object.entries(upsertFilesDto)) {
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

      // TODO fix this: not necessarily the date of today
      const dailyDataForDay = await this.dailyDataService.findOneDailyData(
        userId,
        new Date().toLocaleDateString(),
      );

      // at this point we know that the dailyData exists because we call the upsert of the coding-stats.service
      // before this one, so the dailyData will have already been created there
      if (!dailyDataForDay) {
        continue;
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
        return;
      }

      if (!existingFileData) {
        // if the data for this file doesn't exist, create one
        const createdFileData = await this.filesService.createFile({
          projectId: returningProjectData.projectId,
          dailyDataId: dailyDataForDay.id,
          languageId: fileLanguage.languageId,
          fileName,
          path: path,
          timeSpent: file.timeSpent,
        });
      } else {
        // else just update the file data
        const updatedFileData = await this.filesService.updateFile({
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
