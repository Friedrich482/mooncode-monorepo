import { ConfigModule } from "@nestjs/config";
import { DailyDataController } from "./daily-data.controller";
import { DailyDataService } from "./daily-data.service";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [DailyDataController],
  providers: [...drizzleProvider, DailyDataService],
  exports: [DailyDataModule],
})
export class DailyDataModule {}
