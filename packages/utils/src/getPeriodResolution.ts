import type { PeriodResolution } from "../../../apps/api/src/coding-stats/coding-stats.dto";
import { differenceInDays } from "date-fns";

const getPeriodResolution = (
  start: string | Date,
  end: string | Date,
): PeriodResolution => {
  const numberOfDays = Math.abs(differenceInDays(start, end));
  const periodResolution =
    numberOfDays < 7 ? "day" : numberOfDays < 31 ? "week" : "month";
  return periodResolution;
};

export default getPeriodResolution;
