import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { LanguagesService } from "src/languages/languages.service";
import { PeriodResolution } from "src/coding-stats/coding-stats.dto";

const getPeriodLanguagesPerDayGroupedByWeeks = async (
  data: Awaited<ReturnType<DailyDataService["findRangeDailyData"]>>,
  periodResolution: PeriodResolution,
  languagesService: LanguagesService,
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

  const entriesWithLanguages = await Promise.all(
    data.map(async (entry) => ({
      ...entry,
      languages: await languagesService.findAllLanguages(entry.id),
    })),
  );

  for (const [index, entry] of entriesWithLanguages.entries()) {
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

    // Set the first entry's week to start from the actual first date in the dataset
    if (index === 0) weekStart = startDate;
    // For the last week (or partial week), extend to include the actual last date
    // We use a threshold of 6 days as a typical week has 7 days
    if (index >= data.length - 6) weekEnd = endDate;

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

export default getPeriodLanguagesPerDayGroupedByWeeks;
