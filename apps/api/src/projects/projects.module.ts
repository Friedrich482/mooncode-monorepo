import { EnvService } from "src/env/env.service";
import { Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  providers: [...drizzleProvider, ProjectsService, EnvService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
