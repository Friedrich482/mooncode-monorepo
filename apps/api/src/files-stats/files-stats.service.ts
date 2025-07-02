import {
  GetDailyFilesStatsForExtensionDtoType,
  GetPeriodProjectsDtoType,
  GetProjectFilesOnPeriodDtoType,
  GetProjectLanguagesPerDayOfPeriodDtoType,
  GetProjectLanguagesTimeOnPeriodType,
  GetProjectOnPeriodDtoType,
  GetProjectPerDayOfPeriodDtoType,
  UpsertFilesStatsDtoType,
} from "./files-stats.dto";
import { FilesStatsDashboardService } from "./files-stats-dashboard.service";
import { FilesStatsExtensionService } from "./files-stats-extension.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FilesStatsService {
  constructor(
    private readonly filesStatsExtensionService: FilesStatsExtensionService,
    private readonly filesStatsDashboardService: FilesStatsDashboardService,
  ) {}

  async getDailyFilesStatsForExtension(
    getDailyFilesStatsForExtensionDto: GetDailyFilesStatsForExtensionDtoType,
  ) {
    return this.filesStatsExtensionService.getDailyFilesStatsForExtension(
      getDailyFilesStatsForExtensionDto,
    );
  }

  async upsert(upsertFilesDto: UpsertFilesStatsDtoType) {
    return this.filesStatsExtensionService.upsert(upsertFilesDto);
  }

  async getPeriodProjects(getPeriodProjectsDto: GetPeriodProjectsDtoType) {
    return this.filesStatsDashboardService.getPeriodProjects(
      getPeriodProjectsDto,
    );
  }

  async getProjectOnPeriod(getProjectOnPeriodDto: GetProjectOnPeriodDtoType) {
    return this.filesStatsDashboardService.getProjectOnPeriod(
      getProjectOnPeriodDto,
    );
  }

  async getProjectPerDayOfPeriod(
    getProjectPerDayOfPeriodDto: GetProjectPerDayOfPeriodDtoType,
  ) {
    return this.filesStatsDashboardService.getProjectPerDayOfPeriod(
      getProjectPerDayOfPeriodDto,
    );
  }

  async getProjectLanguagesTimeOnPeriod(
    getProjectLanguagesTimeOnPeriod: GetProjectLanguagesTimeOnPeriodType,
  ) {
    return this.filesStatsDashboardService.getProjectLanguagesTimeOnPeriod(
      getProjectLanguagesTimeOnPeriod,
    );
  }

  async getProjectLanguagesPerDayOfPeriod(
    getProjectLanguagesPerDayOfPeriodDto: GetProjectLanguagesPerDayOfPeriodDtoType,
  ) {
    return this.filesStatsDashboardService.getProjectLanguagesPerDayOfPeriod(
      getProjectLanguagesPerDayOfPeriodDto,
    );
  }

  async getProjectFilesOnPeriod(
    getProjectFilesOnPeriodDto: GetProjectFilesOnPeriodDtoType,
  ) {
    return this.filesStatsDashboardService.getProjectFilesOnPeriod(
      getProjectFilesOnPeriodDto,
    );
  }
}
