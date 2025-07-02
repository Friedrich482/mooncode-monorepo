import { endOfMonth, format, startOfMonth } from "date-fns";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { LanguagesService } from "src/languages/languages.service";

const getPeriodLanguagesGroupByMonths = async (
  data: Awaited<ReturnType<DailyDataService["findRangeDailyData"]>>,
  languagesService: LanguagesService,
) => {
  if (data.length === 0) return [];

  const monthlyMap = new Map<
    string,
    {
      month: string;
      timeSpent: number;
      startDate: Date;
      endDate: Date;
      languages: Record<string, number>;
    }
  >();
  const lastEntry = data.at(-1);
  if (!lastEntry) {
    return [];
  }
  const endDate = new Date(lastEntry.date);

  const entriesWithLanguages = await Promise.all(
    data.map(async (entry) => ({
      ...entry,
      languages: await languagesService.findAllLanguages({
        dailyDataId: entry.id,
      }),
    })),
  );

  for (const [, entry] of entriesWithLanguages.entries()) {
    const date = new Date(entry.date);
    let monthEnd = endOfMonth(date);
    const monthStart = startOfMonth(date);
    monthEnd = endDate < monthEnd ? endDate : monthEnd;

    const monthKey = format(monthStart, "yyyy-MM-dd");

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: `${format(monthStart, "MMM d")} - ${format(monthEnd, "MMM d")}`,
        timeSpent: 0,
        startDate: monthStart,
        endDate: monthEnd,
        languages: {},
      });
    }
    const monthEntry = monthlyMap.get(monthKey) as {
      month: string;
      timeSpent: number;
      startDate: Date;
      endDate: Date;
      languages: Record<string, number>;
    };
    monthEntry.timeSpent += entry.timeSpent;

    for (const [lang, time] of Object.entries(entry.languages)) {
      monthEntry.languages[lang] = (monthEntry.languages[lang] || 0) + time;
    }
  }
  return Array.from(monthlyMap.values()).map(
    ({ languages, timeSpent, ...rest }) => ({
      timeSpent,
      ...languages,
      originalDate: rest.month,
      date: rest.month,
    }),
  );
};
export default getPeriodLanguagesGroupByMonths;
