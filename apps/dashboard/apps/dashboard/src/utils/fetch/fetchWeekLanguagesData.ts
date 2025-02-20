import { WeeklyPeriod, weeklyPeriodConfig } from "@/types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";
import getAuthToken from "../getAuthToken";

const fetchWeekLanguagesData = async (period: WeeklyPeriod) => {
  const authToken = getAuthToken();

  const { offset, route, schema } = weeklyPeriodConfig[period];
  const { weekLanguagesTime, daysOfWeekStats } = await fetchAndParseTime(
    authToken,
    route,
    offset,
    schema,
  );

  return { weekLanguagesTime, daysOfWeekStats };
};

export default fetchWeekLanguagesData;
