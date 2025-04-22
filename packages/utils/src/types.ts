export const GroupByZEnum = ["days", "weeks", "months"] as const;
export type GroupBy = (typeof GroupByZEnum)[number];

export type PeriodResolution = "day" | "week" | "month" | "year";
