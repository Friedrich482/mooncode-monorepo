import { endOfWeek, startOfWeek, subWeeks } from "date-fns";

const getWeekWithOffset = (offset: number) => {
  const targetDate = subWeeks(new Date(), offset);
  return {
    start: startOfWeek(targetDate, { weekStartsOn: 1 }).toISOString(),
    end: endOfWeek(targetDate, { weekStartsOn: 1 }).toISOString(),
  };
};

export default getWeekWithOffset;
