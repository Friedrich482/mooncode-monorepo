import { differenceInDays, format } from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import { PeriodStatsDtoType } from "./coding-stats.dto";
import formatDuration from "@repo/utils/formatDuration";
import getDaysOfPeriodStatsGroupByWeeks from "src/utils/getDaysOfPeriodStatsGroupByWeeks";
import getGeneralStatsOnPeriodGroupByWeeks from "src/utils/getGeneralStatsOnPeriodGroupByWeeks";
import getMostUsedLanguageOnPeriod from "src/utils/getMostUsedLanguageOnPeriod";
import getPeriodLanguagesPerDayGroupedByWeeks from "src/utils/getPeriodLanguagesPerDayGroupedByWeeks";

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

    switch (groupBy) {
      case "weeks":
        return getDaysOfPeriodStatsGroupByWeeks(
          dailyDataForPeriod,
          periodResolution,
        );

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
  async getPeriodLanguagesTime({ userId, start, end }: PeriodStatsDtoType) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

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

    switch (groupBy) {
      case "weeks":
        return getPeriodLanguagesPerDayGroupedByWeeks(
          dailyDataForPeriod,
          periodResolution,
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
      default:
        break;
    }

    const numberOfDays = differenceInDays(end, start) + 1;
    const avgTime = formatDuration(
      (
        await this.getTimeSpentOnPeriod({
          userId,
          start,
          end,
        })
      ).rawTime / numberOfDays,
    );

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
      avgTime,
      mostActiveDate: new Date(mostActiveDate).toDateString(),
      mostUsedLanguage,
    };
  }
}
