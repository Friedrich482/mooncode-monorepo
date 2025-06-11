import { ConfigModule } from "@nestjs/config";
import { DailyDataService } from "./daily-data.service";
import { EnvService } from "src/env/env.service";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [...drizzleProvider, DailyDataService, EnvService],
  exports: [DailyDataService],
})
export class DailyDataModule {}
