import { WeeklyPeriod, weeklyPeriodConfig } from "../../types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";

const fetchTimeByDayOfWeek = async (period: WeeklyPeriod) => {
  const { offset, route, schema } = weeklyPeriodConfig[period];

  const { daysOfWeekStats } = await fetchAndParseTime(route, offset, schema);
  return daysOfWeekStats;
};

export default fetchTimeByDayOfWeek;
