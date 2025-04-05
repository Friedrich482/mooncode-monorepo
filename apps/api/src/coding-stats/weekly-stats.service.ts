import { CommonMethodsService } from "./common-methods.service";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import { differenceInDays } from "date-fns";
import formatDuration from "@repo/utils/formatDuration";

@Injectable()
export class WeeklyStatsService {
  constructor(
    private readonly dailyDataService: DailyDataService,
    private readonly languagesService: LanguagesService,
    private readonly commonMethodsService: CommonMethodsService,
  ) {}

  async getDaysOfWeeklyPeriodStats({
    userId,
    start,
    end,
  }: {
    userId: string;
    start: string;
    end: string;
  }) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    return dailyDataForPeriod.map(({ timeSpent, date }) => ({
      timeSpentLine: timeSpent,
      originalDate: new Date(date).toDateString(),
      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      timeSpentBar: timeSpent,
      value: formatDuration(timeSpent),
    }));
  }
  async getWeeklyLanguagesTime({
    userId,
    start,
    end,
  }: {
    userId: string;
    start: string;
    end: string;
  }) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    const totalTimeSpentInTheWeek = dailyDataForPeriod
      .map((day) => day.timeSpent)
      .reduce((acc, curr) => acc + curr, 0);

    const kVLangTime = (
      await Promise.all(
        dailyDataForPeriod.map(({ id }) =>
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
  async getWeeklyLanguagesPerDay({
    userId,
    start,
    end,
  }: {
    userId: string;
    start: string;
    end: string;
  }) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    return await Promise.all(
      dailyDataForPeriod.map(async ({ id, date, timeSpent }) => ({
        originalDate: new Date(date).toDateString(),

        date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        timeSpent,

        ...(await this.languagesService.findAllLanguages(id)),
      })),
    );
  }

  async getWeeklyGeneralStats({
    userId,
    start,
    end,
  }: {
    userId: string;
    start: string;
    end: string;
  }) {
    const numberOfDays = differenceInDays(end, start) + 1;

    const avgTimePerDay = formatDuration(
      (
        await this.commonMethodsService.getTimeSpentOnPeriod({
          userId,
          start,
          end,
        })
      ).rawTime / numberOfDays,
    );

    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    const maxTimeSpentPerDay =
      dailyDataForPeriod.length > 0
        ? Math.max(...dailyDataForPeriod.map((day) => day.timeSpent))
        : 0;

    // TODO fix the fallback date
    const mostActiveDate =
      dailyDataForPeriod.find((day) => day.timeSpent === maxTimeSpentPerDay)
        ?.date || "";

    const weeklyLanguagesTime = await this.getWeeklyLanguagesTime({
      userId,
      start,
      end,
    });
    const mostUsedLanguageTime = weeklyLanguagesTime
      .map((language) => language.time)
      .reduce((max, curr) => (curr > max ? curr : max), 0);
    const mostUsedLanguage = weeklyLanguagesTime.find(
      (language) => language.time === mostUsedLanguageTime,
    )?.languageName;

    return {
      avgTimePerDay,
      mostActiveDate: new Date(mostActiveDate).toDateString(),
      mostUsedLanguage,
    };
  }
}
