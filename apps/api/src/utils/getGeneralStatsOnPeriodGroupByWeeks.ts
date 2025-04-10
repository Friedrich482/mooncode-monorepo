import { differenceInDays, format } from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { PeriodResolution } from "src/coding-stats/coding-stats.dto";
import { PeriodStatsService } from "src/coding-stats/period-stats.service";
import formatDuration from "@repo/utils/formatDuration";
import getDaysOfPeriodStatsGroupByWeeks from "./getDaysOfPeriodStatsGroupByWeeks";
import getMostUsedLanguageOnPeriod from "./getMostUsedLanguageOnPeriod";

const getGeneralStatsOnPeriodGroupByWeeks = async (
  userId: string,
  start: string,
  end: string,
  periodStatsService: PeriodStatsService,
  dailyDataForPeriod: Awaited<
    ReturnType<DailyDataService["findRangeDailyData"]>
  >,
  periodResolution: PeriodResolution,
) => {
  const numberOfWeeks = parseFloat(
    ((differenceInDays(end, start) + 1) / 7).toFixed(2),
  );

  const avgTime = formatDuration(
    (
      await periodStatsService.getTimeSpentOnPeriod({
        userId,
        start,
        end,
      })
    ).rawTime / numberOfWeeks,
  );
  const weeklyDataForPeriod = getDaysOfPeriodStatsGroupByWeeks(
    dailyDataForPeriod,
    periodResolution,
  ).map((entry) => ({
    timeSpent: entry.timeSpentBar,
    originalDate: entry.originalDate,
  }));

  const maxTimeSpentPerWeek =
    weeklyDataForPeriod.length > 0
      ? Math.max(...weeklyDataForPeriod.map((week) => week.timeSpent))
      : 0;
  const mostActiveWeek =
    weeklyDataForPeriod.find((day) => day.timeSpent === maxTimeSpentPerWeek)
      ?.originalDate || format(new Date(), "yyyy-MM-dd");

  const mostUsedLanguage = await getMostUsedLanguageOnPeriod(
    periodStatsService,
    userId,
    start,
    end,
  );

  return {
    avgTime,
    mostActiveDate: mostActiveWeek,
    mostUsedLanguage,
  };
};
export default getGeneralStatsOnPeriodGroupByWeeks;
