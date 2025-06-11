import { ConfigModule } from "@nestjs/config";
import { EnvService } from "src/env/env.service";
import { LanguagesService } from "./languages.service";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule],
  providers: [...drizzleProvider, LanguagesService, EnvService],
  exports: [LanguagesService],
})
export class LanguagesModule {}
