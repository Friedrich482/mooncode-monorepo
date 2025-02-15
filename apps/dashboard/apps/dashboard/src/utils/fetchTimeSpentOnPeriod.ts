import { type Period, periodConfig } from "./types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";
import getAuthToken from "./getAuthToken";

const fetchTimeSpentOnPeriod = async (period: Period) => {
  const authToken = getAuthToken();
  const { offset, route, schema } = periodConfig[period];
  const { timeSpent } = await fetchAndParseTime(
    authToken,
    route,
    offset,
    schema,
  );
  return timeSpent;
};

export default fetchTimeSpentOnPeriod;
