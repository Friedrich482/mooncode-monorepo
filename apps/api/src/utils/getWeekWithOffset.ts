import { endOfDay, startOfDay, subDays } from "date-fns";

const getWeekWithOffset = (offset: number) => {
  const today = new Date();
  const endDate = subDays(today, offset * 7);
  const startDate = subDays(endDate, 6);

  return {
    start: startOfDay(startDate).toLocaleString(),
    end: endOfDay(endDate).toLocaleString(),
  };
};
export default getWeekWithOffset;
