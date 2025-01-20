import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { CodingDataDto } from "./dto/coding-data.dto";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { dailyData } from "src/drizzle/schema/dailyData";
import { languages } from "src/drizzle/schema/languages";

@Injectable()
export class CodingDataService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
  ) {}

  findAll() {
    return `This action returns all codingData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} codingDatum`;
  }

  async upsert(id: number, updateCodingDataDto: CodingDataDto) {
    const { timeSpentPerLanguage, timeSpentToday } = updateCodingDataDto;
    const returningDailyData = {
      dailyDataId: 0,
      timeSpentToday: 0,
    };

    const [existingTimeSpentToday] = await this.db
      .select({ timeSpent: dailyData.timeSpent, id: dailyData.id })
      .from(dailyData)
      .where(eq(dailyData.userId, id));

    if (!existingTimeSpentToday.id) {
      // create daily time if it doesn't exists
      const [dat] = await this.db
        .insert(dailyData)
        .values({
          date: new Date().toISOString(),
          timeSpent: timeSpentToday,
          userId: id,
        })
        .returning({
          timeSpent: dailyData.timeSpent,
          date: dailyData.date,
          id: dailyData.id,
        });
      returningDailyData.dailyDataId = dat.id;
      returningDailyData.timeSpentToday = dat.timeSpent;
    } else {
      // else update it
      const [updatedTimeSpentToday] = await this.db
        .update(dailyData)
        .set({
          timeSpent: timeSpentToday,
        })
        .where(eq(dailyData.userId, id))
        .returning({
          timeSpent: dailyData.timeSpent,
          id: dailyData.id,
        });
      returningDailyData.dailyDataId = updatedTimeSpentToday.id;
      returningDailyData.timeSpentToday = updateCodingDataDto.timeSpentToday;
    }

    const languagesData: {
      timeSpent: number;
      languageName: string;
    }[] = [];

    for (const [key, value] of Object.entries(timeSpentPerLanguage)) {
      const [existingLanguageData] = await this.db
        .select({
          timeSpent: languages.timeSpent,
          languageName: languages.languageName,
        })
        .from(languages)
        .where(
          and(
            eq(languages.dailyDataId, returningDailyData.dailyDataId),
            eq(languages.languageName, key),
          ),
        );
      if (!existingLanguageData.languageName) {
        // if it doesn't exists, create it
        const [languageData] = await this.db
          .insert(languages)
          .values({
            languageName: key,
            timeSpent: value,
            dailyDataId: returningDailyData.dailyDataId,
          })
          .returning({
            languageName: languages.languageName,
            timeSpent: languages.timeSpent,
          });
        languagesData.push(languageData);
      } else {
        // else update it
        const [updatedLanguageData] = await this.db
          .update(languages)
          .set({
            timeSpent: value,
          })
          .where(
            and(
              eq(languages.dailyDataId, dailyData),
              eq(languages.languageName, key),
            ),
          )
          .returning({
            languageName: languages.languageName,
            timeSpent: languages.timeSpent,
          });
        languagesData.push(updatedLanguageData);
      }
    }
    const { timeSpentToday: returningTimeSpentToday } = returningDailyData;
    return { timeSpentToday: returningTimeSpentToday, languagesData };
  }

  remove(id: number) {
    return `This action removes a #${id} codingDatum`;
  }
}
