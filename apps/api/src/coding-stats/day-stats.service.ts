import { DayStatsDtoType, UpsertLanguagesDtoType } from "./coding-stats.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import formatDuration from "@repo/utils/formatDuration";

@Injectable()
export class DayStatsService {
  constructor(
    private readonly dailyDataService: DailyDataService,
    private readonly languagesService: LanguagesService,
  ) {}

  async getDailyStatsForExtension({ userId, dateString }: DayStatsDtoType) {
    const dayData = await this.dailyDataService.findOneDailyData(
      userId,
      dateString,
    );

    if (!dayData?.id) {
      return {
        timeSpent: 0,
        dayLanguagesTime: {},
      };
    }

    const dayLanguagesTime = await this.languagesService.findAllLanguages(
      dayData.id,
    );
    return { timeSpent: dayData.timeSpent, dayLanguagesTime };
  }

  async getDailyStatsForChart({ userId, dateString }: DayStatsDtoType) {
    const providedDate = new Date(dateString);
    const dateLabel =
      dateString === new Date().toLocaleDateString()
        ? "Today"
        : dateString ===
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() - 1,
            ).toLocaleDateString()
          ? "Yesterday"
          : providedDate.toDateString();

    const dayData = await this.dailyDataService.findOneDailyData(
      userId,
      dateString,
    );

    if (!dayData?.id) {
      return {
        formattedTotalTimeSpent: formatDuration(0),
        finalData: [],
        dateLabel,
      };
    }

    const dayLanguagesTime = await this.languagesService.findAllLanguages(
      dayData.id,
    );

    const totalTimeSpent = dayData.timeSpent;

    const finalData = Object.entries(dayLanguagesTime)
      .map(([languageId, timeSpent]) => ({
        languageId,
        timeSpent,
        formattedValue: formatDuration(timeSpent),
        percentage: parseFloat(((timeSpent * 100) / totalTimeSpent).toFixed(2)),
      }))
      .sort((a, b) => b.timeSpent - a.timeSpent);

    const formattedTotalTimeSpent = formatDuration(totalTimeSpent);

    return {
      finalData,
      formattedTotalTimeSpent,
      dateLabel,
    };
  }
  async upsert({
    id,
    updateUpsertLanguagesDto,
  }: {
    id: string;
    updateUpsertLanguagesDto: UpsertLanguagesDtoType;
  }) {
    const { timeSpentPerLanguage, timeSpentToday } = updateUpsertLanguagesDto;
    const todaySDate = new Date().toLocaleString();

    const returningDailyData = {
      dailyDataId: "",
      timeSpentToday: 0,
      date: todaySDate,
    };

    const existingTimeSpentToday = await this.dailyDataService.findOneDailyData(
      id,
      todaySDate,
    );

    if (!existingTimeSpentToday?.id) {
      // create daily time if it doesn't exists
      const createdTimeSpentToday = await this.dailyDataService.createDailyData(
        { timeSpent: timeSpentToday, userId: id },
      );
      returningDailyData.dailyDataId = createdTimeSpentToday.id;
      returningDailyData.timeSpentToday = createdTimeSpentToday.timeSpent;
      returningDailyData.date = createdTimeSpentToday.date;
    } else {
      // else update it
      const updatedTimeSpentToday = await this.dailyDataService.updateDailyData(
        { timeSpent: timeSpentToday, userId: id, date: todaySDate },
      );
      returningDailyData.dailyDataId = updatedTimeSpentToday.id;
      returningDailyData.timeSpentToday = updatedTimeSpentToday.timeSpent;
      returningDailyData.date = updatedTimeSpentToday.date;
    }

    const languagesData: Record<string, number> = {};

    for (const [key, value] of Object.entries(timeSpentPerLanguage)) {
      const existingLanguageData = await this.languagesService.findOneLanguage(
        returningDailyData.dailyDataId,
        key,
      );
      if (!existingLanguageData?.languageName) {
        // if it doesn't exists, create it, for each language
        const createdLanguageData = await this.languagesService.createLanguage({
          dailyDataId: returningDailyData.dailyDataId,
          timeSpent: value,
          languageName: key,
        });
        languagesData[createdLanguageData.languageName] =
          createdLanguageData.timeSpent;
      } else {
        // else update it
        const updatedLanguageData = await this.languagesService.updateLanguage({
          timeSpent: value,
          dailyDataId: returningDailyData.dailyDataId,
          languageName: key,
        });
        languagesData[updatedLanguageData.languageName] =
          updatedLanguageData.timeSpent;
      }
    }
    const { timeSpentToday: returningTimeSpentToday, date } =
      returningDailyData;
    return { date, timeSpentToday: returningTimeSpentToday, languagesData };
  }
}
