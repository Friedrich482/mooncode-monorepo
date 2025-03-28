import { CodingDataRouter } from "./coding-data.router";
import { CodingDataService } from "./coding-data.service";
import { ConfigModule } from "@nestjs/config";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { EnvService } from "src/env/env.service";
import { JwtModule } from "@nestjs/jwt";
import { LanguagesService } from "src/languages/languages.service";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [
    CodingDataService,
    CodingDataRouter,
    ...drizzleProvider,
    DailyDataService,
    LanguagesService,
    EnvService,
  ],
  exports: [CodingDataService, CodingDataRouter],
})
export class CodingDataModule {}
