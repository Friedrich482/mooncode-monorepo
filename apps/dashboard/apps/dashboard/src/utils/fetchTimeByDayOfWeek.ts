import { WeeklyPeriod, weeklyPeriodConfig } from "./types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";
import getAuthToken from "./getAuthToken";

const fetchTimeByDayOfWeek = async (period: WeeklyPeriod) => {
  const authToken = getAuthToken();
  await new Promise((resolve) => setTimeout(resolve, 50000));
  const { offset, route, schema } = weeklyPeriodConfig[period];

  const { daysOfWeekStats } = await fetchAndParseTime(
    authToken,
    route,
    offset,
    schema,
  );
  return daysOfWeekStats;
};

export default fetchTimeByDayOfWeek;
