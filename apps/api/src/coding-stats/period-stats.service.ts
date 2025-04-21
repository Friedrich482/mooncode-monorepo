import { differenceInDays, format } from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import { PeriodStatsDtoType } from "./coding-stats.dto";
import formatDuration from "@repo/utils/formatDuration";
import getDaysOfPeriodStatsGroupByMonths from "src/utils/getDaysOfPeriodStatsGroupByMonths";
import getDaysOfPeriodStatsGroupByWeeks from "src/utils/getDaysOfPeriodStatsGroupByWeeks";
import getGeneralStatsOnPeriodGroupByMonths from "src/utils/getGeneralStatsOnPeriodGroupByMonths";
import getGeneralStatsOnPeriodGroupByWeeks from "src/utils/getGeneralStatsOnPeriodGroupByWeeks";
import getMostUsedLanguageOnPeriod from "src/utils/getMostUsedLanguageOnPeriod";
import getPeriodLanguagesGroupByMonths from "src/utils/getPeriodLanguagesGroupByMonths";
import getPeriodLanguagesGroupByWeeks from "src/utils/getPeriodLanguagesGroupByWeeks";

@Injectable()
export class PeriodStatsService {
  constructor(
    private readonly dailyDataService: DailyDataService,
    private readonly languagesService: LanguagesService,
  ) {}

  async getTimeSpentOnPeriod({
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

    const timeSpent = dailyDataForPeriod
      .map((day) => day.timeSpent)
      .reduce((acc, curr) => acc + curr, 0);

    return { rawTime: timeSpent, formattedTime: formatDuration(timeSpent) };
  }

  async getDaysOfPeriodStats({
    userId,
    start,
    end,
    groupBy,
    periodResolution,
  }: PeriodStatsDtoType) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    if (dailyDataForPeriod.length === 0) return [];

    switch (groupBy) {
      case "weeks":
        return getDaysOfPeriodStatsGroupByWeeks(
          dailyDataForPeriod,
          periodResolution,
        );

      case "months":
        return getDaysOfPeriodStatsGroupByMonths(dailyDataForPeriod);

      default:
        break;
    }

    return dailyDataForPeriod.map(({ timeSpent, date }) => ({
      timeSpentLine: timeSpent,
      originalDate: new Date(date).toDateString(),
      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      timeSpentBar: timeSpent,
      value: formatDuration(timeSpent),
    }));
  }

  async getPeriodLanguagesTime({
    userId,
    start,
    end,
  }: Omit<PeriodStatsDtoType, "periodResolution">) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    if (dailyDataForPeriod.length === 0) return [];

    const totalTimeSpentOnPeriod = (
      await this.getTimeSpentOnPeriod({ userId, start, end })
    ).rawTime;

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
          ((timeSpent * 100) / totalTimeSpentOnPeriod).toFixed(2),
        ),
      }))
      .sort((a, b) => a.time - b.time);

    return finalData;
  }

  async getPeriodLanguagesPerDay({
    userId,
    start,
    end,
    groupBy,
    periodResolution,
  }: PeriodStatsDtoType) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    if (dailyDataForPeriod.length === 0) return [];

    switch (groupBy) {
      case "weeks":
        return getPeriodLanguagesGroupByWeeks(
          dailyDataForPeriod,
          periodResolution,
          this.languagesService,
        );

      case "months":
        return getPeriodLanguagesGroupByMonths(
          dailyDataForPeriod,
          this.languagesService,
        );

      default:
        break;
    }

    const allLanguages = await Promise.all(
      dailyDataForPeriod.map(({ id }) =>
        this.languagesService.findAllLanguages(id),
      ),
    );

    return dailyDataForPeriod.map(({ date, timeSpent }, index) => ({
      originalDate: new Date(date).toDateString(),
      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      timeSpent,
      ...allLanguages[index],
    }));
  }

  async getPeriodGeneralStats({
    userId,
    start,
    end,
    groupBy,
    periodResolution,
  }: PeriodStatsDtoType) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    if (dailyDataForPeriod.length === 0)
      return {
        avgTime: formatDuration(0),
        percentageToAvg: 0,
        mostActiveDate: new Date().toLocaleDateString(),
        mostUsedLanguage: "other",
      };

    switch (groupBy) {
      case "weeks":
        return getGeneralStatsOnPeriodGroupByWeeks(
          userId,
          start,
          end,
          this,
          dailyDataForPeriod,
          periodResolution,
        );

      case "months":
        return getGeneralStatsOnPeriodGroupByMonths(
          userId,
          start,
          end,
          this,
          dailyDataForPeriod,
        );

      default:
        break;
    }

    const numberOfDays = differenceInDays(end, start) + 1;
    const timeSpentOnPeriod = (
      await this.getTimeSpentOnPeriod({
        userId,
        start,
        end,
      })
    ).rawTime;

    const mean = timeSpentOnPeriod / numberOfDays;

    const timeSpentToday =
      (
        await this.dailyDataService.findOneDailyData(
          userId,
          format(new Date(), "yyyy-MM-dd"),
        )
      ).timeSpent || 0;

    const percentageToAvg =
      mean === 0
        ? 0
        : parseFloat((((timeSpentToday - mean) / mean) * 100).toFixed(2));

    const maxTimeSpentPerDay =
      dailyDataForPeriod.length > 0
        ? Math.max(...dailyDataForPeriod.map((day) => day.timeSpent))
        : 0;

    const mostActiveDate =
      dailyDataForPeriod.find((day) => day.timeSpent === maxTimeSpentPerDay)
        ?.date || format(new Date(), "yyyy-MM-dd");
    const mostUsedLanguage = await getMostUsedLanguageOnPeriod(
      this,
      userId,
      start,
      end,
    );

    return {
      avgTime: formatDuration(mean),
      percentageToAvg,
      mostActiveDate: new Date(mostActiveDate).toDateString(),
      mostUsedLanguage,
    };
  }
}
