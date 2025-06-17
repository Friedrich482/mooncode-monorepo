import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { PeriodResolution } from "@repo/utils/types";
import { ProjectsService } from "src/projects/projects.service";

const getProjectLanguagesGroupByWeeks = async (
  data: Awaited<ReturnType<ProjectsService["findProjectByNameOnRange"]>>,
  periodResolution: PeriodResolution,
  languagesTimesPerDayOfPeriod: Record<string, Record<string, number>>,
) => {
  if (data.length === 0) return [];
  const weeklyMap = new Map<
    string,
    {
      weekRange: string;
      timeSpent: number;
      startDate: Date;
      endDate: Date;
      languages: Record<string, number>;
    }
  >();

  const startDate = new Date(data[0].date);
  const endDate = new Date(data[data.length - 1].date);

  const entriesWithLanguages = data.map((entry) => ({
    ...entry,
    languages: languagesTimesPerDayOfPeriod[entry.date] || {},
  }));

  for (const [, entry] of entriesWithLanguages.entries()) {
    const date = new Date(entry.date);
    let weekStart = startOfWeek(date);
    let weekEnd = endOfWeek(date);

    if (periodResolution === "month") {
      // Adjust week boundaries to ensure they don't extend beyond the month start/end
      const monthStart = startOfMonth(startDate);
      const monthEnd = endOfMonth(endDate);
      weekStart = weekStart < monthStart ? monthStart : weekStart;
      weekEnd = weekEnd > monthEnd ? monthEnd : weekEnd;
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

    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, {
        weekRange: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
        timeSpent: 0,
        startDate: weekStart,
        endDate: weekEnd,
        languages: {},
      });
    }

    const weekEntry = weeklyMap.get(weekKey) as {
      weekRange: string;
      timeSpent: number;
      startDate: Date;
      endDate: Date;
      languages: Record<string, number>;
    };
    weekEntry.timeSpent += entry.timeSpent;

    for (const [lang, time] of Object.entries(entry.languages)) {
      weekEntry.languages[lang] = (weekEntry.languages[lang] || 0) + time;
    }
  }

  return Array.from(weeklyMap.values()).map(
    ({ languages, timeSpent, ...rest }) => ({
      timeSpent,
      ...languages,
      originalDate: rest.weekRange,
      date: rest.weekRange,
    }),
  );
};

export default getProjectLanguagesGroupByWeeks;
