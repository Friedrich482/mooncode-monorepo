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
    const { userId, projectName, path } = createProjectDto;

    const [createdProject] = await this.db
      .insert(projects)
      .values({
        userId,
        projectName,
        path,
      })
      .returning({
        id: projects.id,
        projectName: projects.projectName,
      });

    return createdProject;
  }

  async findOneProject(findProjectDto: FindProjectDtoType) {
    const { userId, projectName, path } = findProjectDto;

    const [project] = await this.db
      .select({
        id: projects.id,
        projectName: projects.projectName,
        path: projects.path,
      })
      .from(projects)
      .where(
        and(
          eq(projects.userId, userId),
          eq(projects.projectName, projectName),
          eq(projects.path, path),
        ),
      );

    if (!project) return null;

    return project;
  }

  async findAllProjects(userId: string) {
    const userProjects = await this.db
      .select({
        id: projects.id,
        projectName: projects.projectName,
        path: projects.path,
      })
      .from(projects)
      .where(eq(projects.userId, userId));

    const userProjectRecord = Object.fromEntries(
      userProjects.map(({ path, projectName }) => [projectName, { path }]),
    );

    return userProjectRecord;
  }

  async updateProject(
    projectId: string,
    updateProjectDto: UpdateProjectDtoType,
  ) {
    const { path, projectName } = updateProjectDto;

    const [updatedProject] = await this.db
      .update(projects)
      .set({
        projectName,
        path,
      })
      .where(eq(projects.id, projectId))
      .returning({
        projectName: projects.projectName,
        path: projects.path,
      });

    return updatedProject;
  }
}
