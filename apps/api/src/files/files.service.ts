import {
  CreateFileDtoType,
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
    const { languageId, dailyDataId, projectId, fileName, timeSpent, path } =
      createFileDto;

    const [createdFileData] = await this.db
      .insert(files)
      .values({
        dailyDataId,
        languageId,
        projectId,
        fileName,
        path,
        timeSpent,
      })
      .returning({
        fileName: files.fileName,
        timeSpent: files.timeSpent,
      });

    return createdFileData;
  }

  async findOneFile(findOneFileDto: FindOneFileDtoType) {
    const { dailyDataId, projectId, fileName, path } = findOneFileDto;

    const [fileData] = await this.db
      .select({
        fileName: files.fileName,
        filePath: files.path,
        timeSpent: files.timeSpent,
      })
      .from(files)
      .where(
        and(
          eq(files.dailyDataId, dailyDataId),
          eq(files.projectId, projectId),
          eq(files.fileName, fileName),
          eq(files.path, path),
        ),
      );

    if (!fileData) return null;

    return fileData;
  }

  async findAllFiles(dailyDataId: string) {
    const filesDataArray = await this.db
      .select({
        timeSpent: files.timeSpent,
        filePath: files.path,
        projectPath: projects.path,
        projectName: projects.projectName,
        language: languages.languageName,
      })
      .from(files)
      .innerJoin(projects, eq(projects.id, files.projectId))
      .innerJoin(languages, eq(languages.id, files.languageId))
      .where(eq(files.dailyDataId, dailyDataId))
      .orderBy(asc(files.timeSpent));

    const filesDataObject = Object.fromEntries(
      filesDataArray.map(
        ({ filePath, timeSpent, projectPath, language, projectName }) => [
          filePath,
          { timeSpent, projectPath, language, projectName },
        ],
      ),
    );

    return filesDataObject;
  }

  async updateFile(updateFileDto: UpdateFileDtoType) {
    const { timeSpent, dailyDataId, projectId, languageId, fileName, path } =
      updateFileDto;

    const [updatedFileData] = await this.db
      .update(files)
      .set({
        timeSpent,
      })
      .where(
        and(
          eq(files.dailyDataId, dailyDataId),
          eq(files.projectId, projectId),
          eq(files.languageId, languageId),
          eq(files.fileName, fileName),
          eq(files.path, path),
        ),
      )
      .returning({
        fileName: files.fileName,
        filePath: files.path,
        timeSpent: files.timeSpent,
      });

    return updatedFileData;
  }
}
