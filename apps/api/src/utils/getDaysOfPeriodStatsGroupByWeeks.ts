import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { PeriodResolution } from "src/coding-stats/coding-stats.dto";
import formatDuration from "@repo/utils/formatDuration";

const getDaysOfPeriodStatsGroupByWeeks = (
  data: Awaited<ReturnType<DailyDataService["findRangeDailyData"]>>,
  periodResolution: PeriodResolution,
) => {
  const weeklyMap = new Map<
    string,
    {
      weekRange: string;
      timeSpent: number;
      startDate: Date;
      endDate: Date;
    }
  >();
  const startDate = new Date(data[0].date);
  const endDate = new Date((data.at(-1) as (typeof data)[0]).date);

  data.forEach((entry, index) => {
    const date = new Date(entry.date);

    let weekStart = startOfWeek(date);
    let weekEnd = endOfWeek(date);

    if (periodResolution === "month") {
      const monthStart = startOfMonth(startDate);
      const monthEnd = endOfMonth(endDate);
      weekStart = weekStart < monthStart ? monthStart : weekStart;
      weekEnd =
        weekEnd > monthEnd
          ? monthEnd
          : index >= data.length - 6
            ? endDate
            : weekEnd;
    }

    if (periodResolution === "week") {
      // adjust week boundaries to make sure that the first "week" starts with the first day of the range
      // and the last "week" ends with the last day of the range

      if (date <= endOfWeek(startDate)) {
        weekStart = startDate;
      }

      if (date >= startOfWeek(endDate)) {
        weekEnd = endDate;
      }
    }

    const weekKey = format(weekStart, "yyyy-MM-dd");

    const existing = weeklyMap.get(weekKey) || {
      weekRange: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
      timeSpent: 0,
      startDate: weekStart,
      endDate: weekEnd,
    };

    weeklyMap.set(weekKey, {
      ...existing,
      timeSpent: existing.timeSpent + entry.timeSpent,
    });
  });

  return Array.from(weeklyMap.values()).map(({ timeSpent, weekRange }) => ({
    timeSpentLine: timeSpent,
    originalDate: weekRange,
    date: weekRange,
    timeSpentBar: timeSpent,
    value: formatDuration(timeSpent),
  }));
};

export default getDaysOfPeriodStatsGroupByWeeks;
