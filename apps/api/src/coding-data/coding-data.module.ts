import { CodingDataController } from "./coding-data.controller";
import { CodingDataService } from "./coding-data.service";
import { ConfigModule } from "@nestjs/config";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { JwtModule } from "@nestjs/jwt";
import { LanguagesService } from "src/languages/languages.service";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [CodingDataController],
  providers: [
    CodingDataService,
    ...drizzleProvider,
    DailyDataService,
    LanguagesService,
  ],
})
export class CodingDataModule {}
