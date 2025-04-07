import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import formatDuration from "@repo/utils/formatDuration";

const getWeeklyDataForPeriod = (
  data: Awaited<ReturnType<DailyDataService["findRangeDailyData"]>>,
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

  data.forEach((entry) => {
    const date = new Date(entry.date);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    let weekStart = startOfWeek(date);
    let weekEnd = endOfWeek(date);

    if (weekStart < monthStart) {
      weekStart = monthStart;
    }

    if (weekEnd > monthEnd) {
      weekEnd = monthEnd;
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

export default getWeeklyDataForPeriod;
