import { endOfWeek, startOfWeek } from "date-fns";

const countStrictWeeks = (start: Date, end: Date) => {
  let weeks = 0;
  let current = startOfWeek(start);

  while (current <= new Date(end)) {
    weeks++;
    current = endOfWeek(current);
    current.setDate(current.getDate() + 1);
  }
  return weeks;
};

export default countStrictWeeks;
