export type Period =
  | "Today"
  | "Yesterday"
  | "Last 3 days"
  | "Past week"
  | "This week"
  | "Past 2 weeks"
  | "Previous month"
  | "This month";

export type WeeklyPeriod = Extract<Period, "Past week" | "This week">;

export const offsets = {
  "Past week": 1,
  Today: 0,
  Yesterday: 1,
  "Last 3 days": 3,
  "This week": 0,
  "Past 2 weeks": 2,
  "This month": 0,
  "Previous month": 1,
} as const;
