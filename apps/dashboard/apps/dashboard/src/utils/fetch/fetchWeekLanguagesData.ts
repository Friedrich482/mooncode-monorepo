import { WeeklyPeriod, weeklyPeriodConfig } from "@/types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";

const fetchWeekLanguagesData = async (period: WeeklyPeriod) => {
  const { offset, route, schema } = weeklyPeriodConfig[period];
  const data = await fetchAndParseTime(route, offset, schema);

  return data;
};

export default fetchWeekLanguagesData;
