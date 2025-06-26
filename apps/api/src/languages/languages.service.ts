import { CreateLanguageDtoType, UpdateLanguageDtoType } from "./languages.dto";
import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { languages } from "src/drizzle/schema/languages";

@Injectable()
export class LanguagesService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase,
  ) {}
  async createLanguage(createLanguageDto: CreateLanguageDtoType) {
    const { dailyDataId, languageSlug, timeSpent } = createLanguageDto;
    const [createdLanguageData] = await this.db
      .insert(languages)
      .values({
        languageSlug,
        timeSpent,
        dailyDataId,
      })
      .returning({
        languageSlug: languages.languageSlug,
        timeSpent: languages.timeSpent,
      });

    return createdLanguageData;
  }

  async findAllLanguages(dailyDataId: string) {
    const languagesDataArray = await this.db
      .select({
        timeSpent: languages.timeSpent,
        languageSlug: languages.languageSlug,
      })
      .from(languages)
      .where(eq(languages.dailyDataId, dailyDataId))
      .orderBy(asc(languages.timeSpent));

    const languagesDataObject: {
      [languageSlug: string]: number;
    } = Object.fromEntries(
      languagesDataArray.map(({ languageSlug, timeSpent }) => [
        languageSlug,
        timeSpent,
      ]),
    );

    return languagesDataObject;
  }

  async findOneLanguage(dailyDataId: string, languageSlug: string) {
    const [languageData] = await this.db
      .select({
        timeSpent: languages.timeSpent,
        languageSlug: languages.languageSlug,
        languageId: languages.id,
      })
      .from(languages)
      .where(
        and(
          eq(languages.dailyDataId, dailyDataId),
          eq(languages.languageSlug, languageSlug),
        ),
      );

    if (!languageData) return null;

    return languageData;
  }

  async updateLanguage(updateLanguageDto: UpdateLanguageDtoType) {
    const { timeSpent, dailyDataId, languageSlug } = updateLanguageDto;

    const [updatedLanguageData] = await this.db
      .update(languages)
      .set({
        timeSpent,
      })
      .where(
        and(
          eq(languages.dailyDataId, dailyDataId),
          eq(languages.languageSlug, languageSlug),
        ),
      )
      .returning({
        languageSlug: languages.languageSlug,
        timeSpent: languages.timeSpent,
      });

    return updatedLanguageData;
  }
}
