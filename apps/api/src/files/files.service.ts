import {
  CreateFileDtoType,
  FindAllFilesOnDayDtoType,
  FindOneFileDtoType,
  UpdateFileDtoType,
} from "./files.dto";
import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { files } from "src/drizzle/schema/files";
import { languages } from "src/drizzle/schema/languages";
import { projects } from "src/drizzle/schema/projects";

@Injectable()
export class FilesService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase,
  ) {}

  async createFile(createFileDto: CreateFileDtoType) {
    const { languageId, projectId, name, timeSpent, path } = createFileDto;

    const [createdFileData] = await this.db
      .insert(files)
      .values({
        languageId,
        projectId,
        name,
        path,
        timeSpent,
      })
      .returning({
        name: files.name,
        timeSpent: files.timeSpent,
        path: files.path,
      });

    return createdFileData;
  }

  async findOneFile(findOneFileDto: FindOneFileDtoType) {
    const { languageId, projectId, name, path } = findOneFileDto;

    const [fileData] = await this.db
      .select({
        name: files.name,
        path: files.path,
        timeSpent: files.timeSpent,
      })
      .from(files)
      .where(
        and(
          eq(files.languageId, languageId),
          eq(files.projectId, projectId),
          eq(files.name, name),
          eq(files.path, path),
        ),
      );

    if (!fileData) return null;

    return fileData;
  }

  async findAllFilesOnDay(findAllFilesOnDayDto: FindAllFilesOnDayDtoType) {
    const { dailyDataId } = findAllFilesOnDayDto;

    const filesDataArray = await this.db
      .select({
        languageSlug: languages.languageSlug,
        timeSpent: files.timeSpent,
        fileName: files.name,
        filePath: files.path,
        projectName: projects.name,
        projectPath: projects.path,
      })
      .from(files)
      .innerJoin(projects, eq(projects.id, files.projectId))
      .innerJoin(languages, eq(languages.id, files.languageId))
      .where(eq(projects.dailyDataId, dailyDataId))
      .orderBy(asc(files.timeSpent));

    const filesDataObject = Object.fromEntries(
      filesDataArray.map(
        ({
          languageSlug,
          timeSpent,
          fileName,
          filePath,
          projectName,
          projectPath,
        }) => [
          filePath,
          { languageSlug, timeSpent, projectPath, projectName, fileName },
        ],
      ),
    );

    return filesDataObject;
  }

  async updateFile(updateFileDto: UpdateFileDtoType) {
    const { timeSpent, projectId, languageId, name, path } = updateFileDto;

    const [updatedFileData] = await this.db
      .update(files)
      .set({
        timeSpent,
      })
      .where(
        and(
          eq(files.projectId, projectId),
          eq(files.languageId, languageId),
          eq(files.name, name),
          eq(files.path, path),
        ),
      )
      .returning({
        name: files.name,
        path: files.path,
        timeSpent: files.timeSpent,
      });

    return updatedFileData;
  }
}
