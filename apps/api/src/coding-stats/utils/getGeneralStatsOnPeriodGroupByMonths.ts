import { differenceInMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { PeriodStatsService } from "src/coding-stats/period-stats.service";
import formatDuration from "@repo/utils/formatDuration";
import getDaysOfPeriodStatsGroupByMonths from "./getDaysOfPeriodStatsGroupByMonths";
import getMostUsedLanguageOnPeriod from "./getMostUsedLanguageOnPeriod";

const getGeneralStatsOnPeriodGroupByMonths = async (
  userId: string,
  start: string,
  end: string,
  periodStatsService: PeriodStatsService,
  dailyDataForPeriod: Awaited<
    ReturnType<DailyDataService["findRangeDailyData"]>
  >,
) => {
  const numberOfMonths = differenceInMonths(end, start) + 1;
  const timeSpentOnPeriod = (
    await periodStatsService.getTimeSpentOnPeriod({
      userId,
      start,
      end,
    })
  ).rawTime;
  const mean = timeSpentOnPeriod / numberOfMonths;

  const monthlyDataForPeriod = getDaysOfPeriodStatsGroupByMonths(
    dailyDataForPeriod,
  ).map((entry) => ({
    timeSpent: entry.timeSpentBar,
    originalDate: entry.originalDate,
  }));

  const timeSpentOnTodaySMonth = (
    await periodStatsService.getTimeSpentOnPeriod({
      userId,
      start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    })
  ).rawTime;

  const percentageToAvg =
    mean === 0
      ? 0
      : parseFloat((((timeSpentOnTodaySMonth - mean) / mean) * 100).toFixed(2));

  const maxTimeSpentPerMonth =
    monthlyDataForPeriod.length > 0
      ? Math.max(...monthlyDataForPeriod.map((month) => month.timeSpent))
      : 0;

  const mostActiveMonth =
    monthlyDataForPeriod.find(
      (month) => month.timeSpent === maxTimeSpentPerMonth,
    )?.originalDate || format(new Date(), "yyyy-MM-dd");

  const mostUsedLanguage = await getMostUsedLanguageOnPeriod(
    periodStatsService,
    userId,
    start,
    end,
  );

  return {
    avgTime: formatDuration(mean),
    percentageToAvg,
    mostActiveDate: mostActiveMonth,
    mostUsedLanguage,
  };
};

export default getGeneralStatsOnPeriodGroupByMonths;
