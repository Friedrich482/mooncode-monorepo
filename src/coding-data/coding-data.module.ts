import { CodingDataController } from "./coding-data.controller";
import { CodingDataService } from "./coding-data.service";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [CodingDataController],
  providers: [CodingDataService, ...drizzleProvider],
})
export class CodingDataModule {}
