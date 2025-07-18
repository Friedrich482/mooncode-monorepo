import { format } from "date-fns";

const convertToISODate = (date: Date | string) => {
  return format(date, "yyyy-MM-dd");
};

export default convertToISODate;
