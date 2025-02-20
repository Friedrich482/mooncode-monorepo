import {
  type Period,
  dailyPeriodSchema,
  periodConfig,
  weeklyPeriodSchema,
} from "../../types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";
import getAuthToken from "../getAuthToken";

const fetchPeriodTimeSpent = async (period: Period) => {
  const authToken = getAuthToken();
  const { offset, route, schema } = periodConfig[period];

  const commonSchema =
    schema === dailyPeriodSchema
      ? schema.pick({ timeSpent: true })
      : weeklyPeriodSchema.pick({ timeSpent: true });

  const { timeSpent } = await fetchAndParseTime(
    authToken,
    route,
    offset,
    commonSchema,
  );
  return timeSpent;
};

export default fetchPeriodTimeSpent;
