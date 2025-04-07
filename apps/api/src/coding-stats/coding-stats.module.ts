import { CodingStatsRouter } from "./coding-stats.router";
import { CodingStatsService } from "./coding-stats.service";
import { ConfigModule } from "@nestjs/config";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { DayStatsService } from "./day-stats.service";
import { EnvService } from "src/env/env.service";
import { JwtModule } from "@nestjs/jwt";
import { LanguagesService } from "src/languages/languages.service";
import { Module } from "@nestjs/common";
import { PeriodStatsService } from "./period-stats.service";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [
    CodingStatsService,
    CodingStatsRouter,
    ...drizzleProvider,
    DailyDataService,
    LanguagesService,
    EnvService,
    DayStatsService,
    PeriodStatsService,
  ],
  exports: [CodingStatsService, CodingStatsRouter],
})
export class CodingStatsModule {}
