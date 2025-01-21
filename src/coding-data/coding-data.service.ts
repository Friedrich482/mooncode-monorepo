import { Inject, Injectable } from "@nestjs/common";
import { CodingDataDto } from "./dto/coding-data.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { DrizzleAsyncProvider } from "src/drizzle/drizzle.provider";
import { LanguagesService } from "src/languages/languages.service";

@Injectable()
export class CodingDataService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private dailyDataService: DailyDataService,
    private languagesService: LanguagesService,
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

    const existingTimeSpentToday =
      await this.dailyDataService.findOneDailyData(id);

    if (!existingTimeSpentToday.id) {
      // create daily time if it doesn't exists
      const createdTimeSpentToday = await this.dailyDataService.createDailyData(
        { timeSpent: timeSpentToday, userId: id },
      );
      returningDailyData.dailyDataId = createdTimeSpentToday.id;
      returningDailyData.timeSpentToday = createdTimeSpentToday.timeSpent;
    } else {
      // else update it
      const updatedTimeSpentToday = await this.dailyDataService.updateDailyData(
        { timeSpent: timeSpentToday, userId: id },
      );
      returningDailyData.dailyDataId = updatedTimeSpentToday.id;
      returningDailyData.timeSpentToday = updateCodingDataDto.timeSpentToday;
    }

    const languagesData: {
      timeSpent: number;
      languageName: string;
    }[] = [];

    for (const [key, value] of Object.entries(timeSpentPerLanguage)) {
      const existingLanguageData = await this.languagesService.findOneLanguage(
        returningDailyData.dailyDataId,
        key,
      );
      if (!existingLanguageData.languageName) {
        // if it doesn't exists, create it
        const createdLanguageData = await this.languagesService.createLanguage({
          dailyDataId: returningDailyData.dailyDataId,
          timeSpent: value,
          languageName: key,
        });
        languagesData.push(createdLanguageData);
      } else {
        // else update it
        const updatedLanguageData = await this.languagesService.updateLanguage(
          returningDailyData.dailyDataId,
          { timeSpent: value },
          key,
        );
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
