import {
  type Period,
  dailyPeriodSchema,
  periodConfig,
  weeklyPeriodSchema,
} from "../../types-schemas";
import fetchAndParseTime from "./fetchAndParseTime";

const fetchPeriodTimeSpent = async (period: Period) => {
  const { offset, route, schema } = periodConfig[period];

  const commonSchema =
    schema === dailyPeriodSchema
      ? schema.pick({ timeSpent: true })
      : weeklyPeriodSchema.pick({ timeSpent: true });

  const { timeSpent } = await fetchAndParseTime(route, offset, commonSchema);
  return timeSpent;
};

export default fetchPeriodTimeSpent;
