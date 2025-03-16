export type Period =
  | "Today"
  | "Yesterday"
  | "Last 3 days"
  | "Past week"
  | "This week"
  | "Past 2 weeks"
  | "Previous month"
  | "This month";

export type WeeklyPeriod = "Past week" | "This week";

export const periodConfig = {
  "Past week": {
    offset: 1,
  },
  Today: {
    offset: 0,
  },
  Yesterday: {
    offset: 1,
  },
  "Last 3 days": {
    offset: 3,
  },
  "This week": {
    offset: 0,
  },
  "Past 2 weeks": {
    offset: 2,
  },
  "This month": {
    offset: 0,
  },
  "Previous month": {
    offset: 1,
  },
} as const;

// use the Object keyword to easily infer this one
export const weeklyPeriodConfig = {
  "This week": periodConfig["This week"],
  "Past week": periodConfig["Past week"],
} as const;
