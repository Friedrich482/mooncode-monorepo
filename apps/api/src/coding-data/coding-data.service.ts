import { CodingDataDtoType } from "./coding-data.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Date } from "src/types";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import getDayWithOffset from "src/utils/getDayWithOffset";
import getWeekWithOffset from "src/utils/getWeekWithOffset";

@Injectable()
export class CodingDataService {
  constructor(
    private dailyDataService: DailyDataService,
    private languagesService: LanguagesService,
  ) {}

  async findDaily({
    userId,
    offset = 0,
  }: {
    userId: string;
    offset: number | undefined;
  }) {
    const targetDate = getDayWithOffset(offset);

    const dayData = await this.dailyDataService.findOneDailyData(
      userId,
      targetDate,
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

  async findWeekly({
    userId,
    offset = 0,
  }: {
    userId: string;
    offset: number | undefined;
  }) {
    const { start, end } = getWeekWithOffset(offset);
    const weekData = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    const timeSpent = weekData
      .map((day) => day.timeSpent)
      .reduce((acc, curr) => acc + curr, 0);

    const daysOfWeekStats: Record<
      Date,
      {
        timeSpent: number;
        languages: Record<string, number>;
      }
    > = {};

    await Promise.all(
      weekData.map(async ({ id, timeSpent, date }) => {
        daysOfWeekStats[date] = {
          timeSpent,
          languages: await this.languagesService.findAllLanguages(id),
        };
      }),
    );

    const weekLanguagesTime = (
      await Promise.all(
        weekData.map(({ id }) => this.languagesService.findAllLanguages(id)),
      )
    ).reduce((acc, dayStats) => {
      Object.keys(dayStats).forEach((language) => {
        acc[language] = (acc[language] || 0) + dayStats[language];
      });
      return acc;
    }, {});

    return { timeSpent, weekLanguagesTime, daysOfWeekStats };
  }

  async upsert({
    id,
    updateCodingDataDto,
  }: {
    id: string;
    updateCodingDataDto: CodingDataDtoType;
  }) {
    const { timeSpentPerLanguage, timeSpentToday } = updateCodingDataDto;
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
