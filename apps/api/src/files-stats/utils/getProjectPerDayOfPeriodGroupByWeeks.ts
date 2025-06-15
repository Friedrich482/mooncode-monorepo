import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { PeriodResolution } from "@repo/utils/types";
import { ProjectsService } from "src/projects/projects.service";
import formatDuration from "@repo/utils/formatDuration";

const getProjectPerDayOfPeriodGroupByWeeks = (
  data: Awaited<ReturnType<ProjectsService["findProjectByNameOnRange"]>>,
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
  const lastEntry = data.at(-1);
  if (!lastEntry) return [];

  const endDate = new Date(lastEntry.date);

  data.forEach((entry, index) => {
    const date = new Date(entry.date);

    let weekStart = startOfWeek(date);
    let weekEnd = endOfWeek(date);

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

    if (periodResolution === "year") {
      weekEnd = index >= data.length - 6 ? endDate : weekEnd;
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

export default getProjectPerDayOfPeriodGroupByWeeks;
