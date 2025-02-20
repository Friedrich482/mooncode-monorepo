import { WeeklyPeriod, weeklyPeriodConfig } from "@/types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";

const fetchWeekLanguagesData = async (period: WeeklyPeriod) => {
  const { offset, route, schema } = weeklyPeriodConfig[period];
  const { weekLanguagesTime, daysOfWeekStats } = await fetchAndParseTime(
    route,
    offset,
    schema,
  );

  return { weekLanguagesTime, daysOfWeekStats };
};

export default fetchWeekLanguagesData;
