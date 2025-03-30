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
