import { CodingStatsDtoType } from "./coding-stats.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import findDailyDataForWeek from "src/utils/findDailyDataForWeek";
import formatDuration from "@repo/utils/formatDuration";
import getDayWithOffset from "src/utils/getDayWithOffset";

@Injectable()
export class CodingStatsService {
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

  async getDailyStatsForChart({
    userId,
    offset = 0,
  }: {
    userId: string;
    offset: number | undefined;
  }) {
    const targetDate = getDayWithOffset(offset);
    const date =
      offset === 0
        ? "Today"
        : offset === -1
          ? "Yesterday"
          : new Date(targetDate).toDateString();

    const dayData = await this.dailyDataService.findOneDailyData(
      userId,
      targetDate,
    );

    if (!dayData?.id) {
      return {
        formattedTotalTimeSpent: formatDuration(0),
        finalData: [],
        date,
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
      date,
    };
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
      originalDate: new Date(date).toDateString(),
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

    const finalData = Object.entries(kVLangTime)
      .map(([languageName, timeSpent]) => ({
        languageName,
        time: timeSpent,
        value: formatDuration(timeSpent),
        percentage: parseFloat(
          ((timeSpent * 100) / totalTimeSpentInTheWeek).toFixed(2),
        ),
      }))
      .sort((a, b) => a.time - b.time);

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
        originalDate: new Date(date).toDateString(),

        date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        timeSpent,

        ...(await this.languagesService.findAllLanguages(id)),
      })),
    );
  }

  async getGeneralStatsPerWeek({
    userId,
    offset = 0,
  }: {
    userId: string;
    offset: number | undefined;
  }) {
    const avgTimePerDay = formatDuration(
      (await this.getTimeSpentOnWeek({ userId, offset })).rawTime / 7,
    );

    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );
    const maxTimeSpentPerDay =
      dailyDataForWeek.length > 0
        ? Math.max(...dailyDataForWeek.map((day) => day.timeSpent))
        : 0;
    // TODO fix the fallback date
    const mostActiveDate =
      dailyDataForWeek.find((day) => day.timeSpent === maxTimeSpentPerDay)
        ?.date || "";

    const weekLanguagesTime = await this.getWeekLanguagesTime({
      userId,
      offset,
    });
    const mostUsedLanguageTime = weekLanguagesTime
      .map((language) => language.time)
      .reduce((max, curr) => (curr > max ? curr : max), 0);
    const mostUsedLanguage = weekLanguagesTime.find(
      (language) => language.time === mostUsedLanguageTime,
    )?.languageName;

    return {
      avgTimePerDay,
      mostActiveDate: new Date(mostActiveDate).toDateString(),
      mostUsedLanguage,
    };
  }

  async upsert({
    id,
    updateCodingStatsDto,
  }: {
    id: string;
    updateCodingStatsDto: CodingStatsDtoType;
  }) {
    const { timeSpentPerLanguage, timeSpentToday } = updateCodingStatsDto;
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
