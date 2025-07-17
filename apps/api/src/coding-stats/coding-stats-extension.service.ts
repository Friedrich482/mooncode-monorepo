import {
  GetDailyStatsForExtensionDtoType,
  UpsertLanguagesDtoType,
} from "./coding-stats.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";

@Injectable()
export class CodingStatsExtensionService {
  constructor(
    private readonly dailyDataService: DailyDataService,
    private readonly languagesService: LanguagesService,
  ) {}

  async getDailyStatsForExtension(
    getDailyStatsForExtensionDto: GetDailyStatsForExtensionDtoType,
  ) {
    const { userId, dateString } = getDailyStatsForExtensionDto;

    const dayData = await this.dailyDataService.findOneDailyData({
      userId,
      date: dateString,
    });

    if (!dayData)
      return {
        timeSpent: 0,
        dayLanguagesTime: {},
      };

    const dayLanguagesTime = await this.languagesService.findAllLanguages({
      dailyDataId: dayData.id,
    });

    return { timeSpent: dayData.timeSpent, dayLanguagesTime };
  }

  async upsert(upsertLanguagesDto: UpsertLanguagesDtoType) {
    const { timeSpentPerLanguage, timeSpentOnDay, targetedDate, userId } =
      upsertLanguagesDto;

    const returningData = {
      dailyDataId: "",
      timeSpentOnDay: 0,
      date: targetedDate,
      languages: {} as { [languageSlug: string]: number },
    };
    const existingTimeSpentOnDay = await this.dailyDataService.findOneDailyData(
      { userId, date: targetedDate },
    );

    if (!existingTimeSpentOnDay) {
      // create daily data if it doesn't exists
      const createdTimeSpentOnDay = await this.dailyDataService.createDailyData(
        { targetedDate, timeSpent: timeSpentOnDay, userId },
      );

      returningData.dailyDataId = createdTimeSpentOnDay.id;
      returningData.timeSpentOnDay = createdTimeSpentOnDay.timeSpent;
      returningData.date = createdTimeSpentOnDay.date;
    } else {
      // else update it but only if the new timeSpent is greater than the existing one
      if (existingTimeSpentOnDay.timeSpent < timeSpentOnDay) {
        const updatedTimeSpentOnDay =
          await this.dailyDataService.updateDailyData({
            timeSpent: timeSpentOnDay,
            userId,
            targetedDate,
          });

        returningData.dailyDataId = updatedTimeSpentOnDay.id;
        returningData.timeSpentOnDay = updatedTimeSpentOnDay.timeSpent;
        returningData.date = updatedTimeSpentOnDay.date;
      } else {
        returningData.dailyDataId = existingTimeSpentOnDay.id;
        returningData.timeSpentOnDay = existingTimeSpentOnDay.timeSpent;
        returningData.date = targetedDate;
      }
    }

    for (const [key, value] of Object.entries(timeSpentPerLanguage)) {
      const existingLanguageData = await this.languagesService.findOneLanguage({
        dailyDataId: returningData.dailyDataId,
        languageSlug: key,
      });

      if (!existingLanguageData) {
        // if it doesn't exists, create it for each language
        const createdLanguageData = await this.languagesService.createLanguage({
          dailyDataId: returningData.dailyDataId,
          timeSpent: value,
          languageSlug: key,
        });

        returningData.languages[createdLanguageData.languageSlug] =
          createdLanguageData.timeSpent;
      } else {
        // else update it but only if the new timeSpent is greater than the existing one
        if (existingLanguageData.timeSpent < value) {
          const updatedLanguageData =
            await this.languagesService.updateLanguage({
              timeSpent: value,
              dailyDataId: returningData.dailyDataId,
              languageSlug: key,
            });
          returningData.languages[updatedLanguageData.languageSlug] =
            updatedLanguageData.timeSpent;
        } else {
          returningData.languages[existingLanguageData.languageSlug] =
            existingLanguageData.timeSpent;
        }
      }
    }
    return returningData;
  }
}
