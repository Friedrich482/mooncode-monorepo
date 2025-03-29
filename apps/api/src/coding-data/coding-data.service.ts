import { CodingDataDtoType } from "./coding-data.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Date } from "src/types";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import findDailyDataForWeek from "src/utils/findDailyDataForWeek";
import formatDuration from "@repo/utils/formatDuration";
import getDayWithOffset from "src/utils/getDayWithOffset";

@Injectable()
export class CodingDataService {
  constructor(
    private dailyDataService: DailyDataService,
    private languagesService: LanguagesService,
  ) {}

  async getDailyStats({
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

  async getTimeSpentOnWeek({
    userId,
    offset = 0,
  }: {
    userId: string;
    offset: number | undefined;
  }) {
    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );

    const timeSpent = dailyDataForWeek
      .map((day) => day.timeSpent)
      .reduce((acc, curr) => acc + curr, 0);

    return { rawTime: timeSpent, formattedTime: formatDuration(timeSpent) };
  }

  async getDaysOfWeekStats({
    userId,
    offset = 0,
  }: {
    userId: string;
    offset: number | undefined;
  }) {
    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );

    return dailyDataForWeek.map(({ timeSpent, date }) => ({
      timeSpentLine: timeSpent,
      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      timeSpentBar: timeSpent,
      value: formatDuration(timeSpent),
    }));
  }
  async getWeekLanguagesTime({
    userId,
    offset = 0,
  }: {
    userId: string;
    offset: number | undefined;
  }) {
    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );

    const totalTimeSpentInTheWeek = dailyDataForWeek
      .map((day) => day.timeSpent)
      .reduce((acc, curr) => acc + curr, 0);

    const kVLangTime = (
      await Promise.all(
        dailyDataForWeek.map(({ id }) =>
          this.languagesService.findAllLanguages(id),
        ),
      )
    ).reduce((acc, dayStats) => {
      Object.keys(dayStats).forEach((language) => {
        acc[language] = (acc[language] || 0) + dayStats[language];
      });
      return acc;
    }, {});

    const finalData = Object.entries(kVLangTime).map(
      ([languageName, timeSpent]) => ({
        languageName,
        time: timeSpent,
        value: formatDuration(timeSpent),
        percentage: ((timeSpent * 100) / totalTimeSpentInTheWeek).toFixed(2),
      }),
    );

    return finalData;
  }
  async getLanguagesWeekPerDay({
    userId,
    offset = 0,
  }: {
    userId: string;
    offset: number | undefined;
  }) {
    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );
    return await Promise.all(
      dailyDataForWeek.map(async ({ id, date, timeSpent }) => ({
        originalDate: date,

        date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        timeSpent,

        ...(await this.languagesService.findAllLanguages(id)),
      })),
    );
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
