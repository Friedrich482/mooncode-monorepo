import { WeeklyPeriod, weeklyPeriodConfig } from "../../types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";
import getAuthToken from "../getAuthToken";

const fetchTimeByDayOfWeek = async (period: WeeklyPeriod) => {
  const authToken = getAuthToken();
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
