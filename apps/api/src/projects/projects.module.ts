import { EnvService } from "src/env/env.service";
import { Module } from "@nestjs/common";
import { ProjectsAnalyticsService } from "./projects-analytics.service";
import { ProjectsCrudService } from "./projects-crud.service";
import { ProjectsService } from "./projects.service";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  providers: [
    ...drizzleProvider,
    ProjectsService,
    ProjectsCrudService,
    ProjectsAnalyticsService,
    EnvService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
