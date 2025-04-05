import { PERIODS } from "./constants";

export type Period = (typeof PERIODS)[number];

export type WeeklyPeriod = Extract<
  Period,
  "Last week" | "This week" | "Last 7 days" | "Last 14 days" | "Last 2 weeks"
>;
