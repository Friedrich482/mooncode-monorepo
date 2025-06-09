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

    if (!dayData)
      return {
        timeSpent: 0,
        dayLanguagesTime: {},
      };

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

    if (!dayData)
      return {
        formattedTotalTimeSpent: formatDuration(0),
        finalData: [],
        dateLabel,
      };

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
    upsertLanguagesDto,
  }: {
    id: string;
    upsertLanguagesDto: UpsertLanguagesDtoType;
  }) {
    const { timeSpentPerLanguage, timeSpentOnDay, targetedDate } =
      upsertLanguagesDto;

    const returningDailyData = {
      dailyDataId: "",
      timeSpentOnDay: 0,
      date: targetedDate,
    };

    const existingTimeSpentOnDay = await this.dailyDataService.findOneDailyData(
      id,
      targetedDate,
    );

    if (!existingTimeSpentOnDay) {
      // create daily data if it doesn't exists
      const createdTimeSpentOnDay = await this.dailyDataService.createDailyData(
        { targetedDate, timeSpent: timeSpentOnDay, userId: id },
      );

      returningDailyData.dailyDataId = createdTimeSpentOnDay.id;
      returningDailyData.timeSpentOnDay = createdTimeSpentOnDay.timeSpent;
      returningDailyData.date = createdTimeSpentOnDay.date;
    } else {
      // else update it but only if the new timeSpent is greater than the existing one
      if (existingTimeSpentOnDay.timeSpent <= timeSpentOnDay) {
        const updatedTimeSpentOnDay =
          await this.dailyDataService.updateDailyData({
            timeSpent: timeSpentOnDay,
            userId: id,
            targetedDate,
          });

        returningDailyData.dailyDataId = updatedTimeSpentOnDay.id;
        returningDailyData.timeSpentOnDay = updatedTimeSpentOnDay.timeSpent;
        returningDailyData.date = updatedTimeSpentOnDay.date;
      }
    }

    const languagesData: Record<string, number> = {};
    for (const [key, value] of Object.entries(timeSpentPerLanguage)) {
      const existingLanguageData = await this.languagesService.findOneLanguage(
        returningDailyData.dailyDataId,
        key,
      );

      if (!existingLanguageData) {
        // if it doesn't exists, create it for each language
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
  }
}
