import { differenceInDays } from "date-fns";

const getCustomRangePeriodResolution = (
  start: string | Date,
  end: string | Date,
) => {
  const numberOfDays = Math.abs(differenceInDays(start, end));
  const periodResolution =
    numberOfDays < 7 ? "day" : numberOfDays < 31 ? "week" : "month";
  return periodResolution;
};

export default getCustomRangePeriodResolution;
