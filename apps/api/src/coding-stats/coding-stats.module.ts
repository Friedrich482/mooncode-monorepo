import { CodingStatsDashboardService } from "./coding-stats-dashboard.service";
import { CodingStatsExtensionService } from "./coding-stats-extension.service";
import { CodingStatsRouter } from "./coding-stats.router";
import { CodingStatsService } from "./coding-stats.service";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { EnvService } from "src/env/env.service";
import { LanguagesService } from "src/languages/languages.service";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  providers: [
    CodingStatsService,
    CodingStatsRouter,
    ...drizzleProvider,
    DailyDataService,
    LanguagesService,
    EnvService,
    CodingStatsDashboardService,
    CodingStatsExtensionService,
  ],
  exports: [CodingStatsService, CodingStatsRouter],
})
export class CodingStatsModule {}
