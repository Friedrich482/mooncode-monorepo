import {
  CreateProjectDtoType,
  FindProjectDtoType,
  UpdateProjectDtoType,
} from "./projects.dto";
import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { projects } from "src/drizzle/schema/projects";

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase,
  ) {}

  async createProject(createProjectDto: CreateProjectDtoType) {
    const { dailyDataId, name, path, timeSpent } = createProjectDto;

    const [createdProject] = await this.db
      .insert(projects)
      .values({
        dailyDataId,
        name,
        path,
        timeSpent,
      })
      .returning({
        id: projects.id,
        name: projects.name,
        timeSpent: projects.timeSpent,
      });

    return createdProject;
  }

  async findOneProject(findProjectDto: FindProjectDtoType) {
    const { dailyDataId, name, path } = findProjectDto;

    const [project] = await this.db
      .select({
        id: projects.id,
        name: projects.name,
        path: projects.path,
        timeSpent: projects.timeSpent,
      })
      .from(projects)
      .where(
        and(
          eq(projects.dailyDataId, dailyDataId),
          eq(projects.name, name),
          eq(projects.path, path),
        ),
      );

    if (!project) return null;

    return project;
  }

  // TODO implement this but findAllRangeProjects like dailyData
  // async findAllProjects(userId: string) {
  //   const userProjects = await this.db
  //     .select({
  //       id: projects.id,
  //       name: projects.name,
  //       path: projects.path,
  //     })
  //     .from(projects)
  //     .where(eq(projects.userId, userId));

  //   const userProjectRecord = Object.fromEntries(
  //     userProjects.map(({ path, name }) => [name, { path }]),
  //   );

  //   return userProjectRecord;
  // }

  async updateProject(updateProjectDto: UpdateProjectDtoType) {
    const { dailyDataId, timeSpent, path, name } = updateProjectDto;

    const [updatedProject] = await this.db
      .update(projects)
      .set({
        timeSpent,
      })
      .where(
        and(
          eq(projects.dailyDataId, dailyDataId),
          eq(projects.path, path),
          eq(projects.name, name),
        ),
      )
      .returning({
        name: projects.name,
        path: projects.path,
      });

    return updatedProject;
  }
}
