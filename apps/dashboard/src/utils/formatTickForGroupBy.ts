import { GroupBy } from "@repo/utils/types";

export const formatTickForGroupBy = (
  value: string,
  groupBy: GroupBy,
): string => {
  return groupBy === "days" || groupBy === "months" ? value.slice(0, 3) : value;
};
