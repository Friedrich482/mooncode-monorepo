import { ConfigModule } from "@nestjs/config";
import { LanguagesService } from "./languages.service";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule],
  providers: [...drizzleProvider, LanguagesService],
})
export class LanguagesModule {}
