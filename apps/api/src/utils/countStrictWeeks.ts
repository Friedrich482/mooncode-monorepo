import { endOfWeek, startOfWeek } from "date-fns";

import { endOfWeek, startOfWeek } from "date-fns";
import { addDays, isBefore, isEqual } from "date-fns";
 
const countStrictWeeks = (start: Date, end: Date) => {
  let weeks = 0;
  // Create a copy to avoid mutating the input date
  let current = startOfWeek(new Date(start));
  const endDate = new Date(end);
 
  while (isBefore(current, endDate) || isEqual(current, endDate)) {
    weeks++;
    // Get end of current week
    const weekEnd = endOfWeek(current);
    // Set current to the start of next week (add one day to week end)
    current = startOfWeek(addDays(weekEnd, 1));
  }
  return weeks;
};

export default countStrictWeeks;
