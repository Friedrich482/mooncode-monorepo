import { format, parse } from "date-fns";

export const convertToISOFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "M/d/yyyy", new Date());
  return format(parsedDate, "yyyy-MM-dd");
};
