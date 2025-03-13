import { CreateLanguageDtoType, UpdateLanguageDtoType } from "./languages.dto";
import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { languages } from "src/drizzle/schema/languages";

@Injectable()
export class LanguagesService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
  ) {}
  async createLanguage(createLanguageDto: CreateLanguageDtoType) {
    const { dailyDataId, languageName, timeSpent } = createLanguageDto;
    const [createdLanguageData] = await this.db
      .insert(languages)
      .values({
        languageName: languageName,
        timeSpent,
        dailyDataId,
      })
      .returning({
        languageName: languages.languageName,
        timeSpent: languages.timeSpent,
      });
    return createdLanguageData;
  }

  async findAllLanguages(dailyDataId: string) {
    const languagesDataArray = await this.db
      .select({
        timeSpent: languages.timeSpent,
        languageName: languages.languageName,
      })
      .from(languages)
      .where(eq(languages.dailyDataId, dailyDataId));

    const languagesDataObject = Object.fromEntries(
      languagesDataArray.map(({ languageName, timeSpent }) => [
        languageName,
        timeSpent,
      ]),
    );
    return languagesDataObject;
  }

  async findOneLanguage(dailyDataId: string, languageName: string) {
    const [languageData] = await this.db
      .select({
        timeSpent: languages.timeSpent,
        languageName: languages.languageName,
      })
      .from(languages)
      .where(
        and(
          eq(languages.dailyDataId, dailyDataId),
          eq(languages.languageName, languageName),
        ),
      );
    return languageData;
  }

  async updateLanguage(updateLanguageDto: UpdateLanguageDtoType) {
    const { timeSpent, dailyDataId, languageName } = updateLanguageDto;
    const [updatedLanguageData] = await this.db
      .update(languages)
      .set({
        timeSpent,
      })
      .where(
        and(
          eq(languages.dailyDataId, dailyDataId),
          eq(languages.languageName, languageName),
        ),
      )
      .returning({
        languageName: languages.languageName,
        timeSpent: languages.timeSpent,
      });
    return updatedLanguageData;
  }

  remove(id: number) {
    return `This action removes a #${id} language`;
  }
}
