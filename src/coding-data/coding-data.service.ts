import { Inject, Injectable } from "@nestjs/common";
import { CreateCodingDataDto } from "./dto/create-coding-data.dto";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UpdateCodingDatumDto } from "./dto/update-coding-data.dto";
import { dailyData } from "src/drizzle/schema/dailyData";
import { languages } from "src/drizzle/schema/languages";

@Injectable()
export class CodingDataService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase,
  ) {}
  async create(id: number, createCodingDataDto: CreateCodingDataDto) {
    const { timeSpentPerLanguage, timeSpentToday } = createCodingDataDto;
    const [createdTimeSpentToday] = await this.db
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
    const languagesData: {
      timeSpent: number;
      languageName: string;
    }[] = [];

    for (const [key, value] of Object.entries(timeSpentPerLanguage)) {
      const [languageData] = await this.db
        .insert(languages)
        .values({
          languageName: key,
          timeSpent: value,
          dailyDataId: createdTimeSpentToday.id,
        })
        .returning({
          timeSpent: languages.timeSpent,
          languageName: languages.languageName,
        });
      languagesData.push(languageData);
    }

    return { createdTimeSpentToday, languagesData };
  }

  findAll() {
    return `This action returns all codingData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} codingDatum`;
  }

  update(id: number, updateCodingDatumDto: UpdateCodingDatumDto) {
    return `This action updates a #${id} codingDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} codingDatum`;
  }
}
