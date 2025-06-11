import { EnvService } from "src/env/env.service";
import { FilesService } from "./files.service";
import { Module } from "@nestjs/common";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  providers: [...drizzleProvider, FilesService, EnvService],
  exports: [FilesService],
})
export class FilesModule {}
