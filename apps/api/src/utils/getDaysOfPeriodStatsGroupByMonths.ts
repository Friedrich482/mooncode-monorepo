import { endOfMonth, format, startOfMonth } from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import formatDuration from "@repo/utils/formatDuration";

const getDaysOfPeriodStatsGroupByMonths = (
  data: Awaited<ReturnType<DailyDataService["findRangeDailyData"]>>,
) => {
  const monthlyMap = new Map<
    string,
    { month: string; timeSpent: number; startDate: Date; endDate: Date }
  >();
  const lastEntry = data.at(-1);
  if (!lastEntry) return [];

  const endDate = new Date(lastEntry.date);
  data.forEach((entry) => {
    const date = new Date(entry.date);
    let monthEnd = endOfMonth(date);
    const monthStart = startOfMonth(date);
    monthEnd = endDate < monthEnd ? endDate : monthEnd;

    const monthKey = format(monthStart, "yyyy-MM-dd");
    const existing = monthlyMap.get(monthKey) || {
      month: `${format(monthStart, "MMM d")} - ${format(monthEnd, "MMM d")}`,
      timeSpent: 0,
      startDate: monthStart,
      endDate: monthEnd,
    };

    monthlyMap.set(monthKey, {
      ...existing,
      timeSpent: existing.timeSpent + entry.timeSpent,
    });
  });

  return Array.from(monthlyMap.values()).map(({ timeSpent, month }) => ({
    timeSpentLine: timeSpent,
    originalDate: month,
    date: month,
    timeSpentBar: timeSpent,
    value: formatDuration(timeSpent),
  }));
};

export default getDaysOfPeriodStatsGroupByMonths;
