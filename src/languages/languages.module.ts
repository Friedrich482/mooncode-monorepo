import { ConfigModule } from "@nestjs/config";
import { LanguagesController } from "./languages.controller";
import { LanguagesService } from "./languages.service";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule],
  controllers: [LanguagesController],
  providers: [...drizzleProvider, LanguagesService],
})
export class LanguagesModule {}
