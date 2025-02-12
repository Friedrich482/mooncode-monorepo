import { z } from "zod";

export const timeSpentDailySchema = z.object({
  timeSpent: z.number().min(0),
  dayLanguages: z.record(z.string().min(1), z.number().min(0)),
});
// export type TimeSpentDaily = z.infer<typeof timeSpentDailySchema>;

export type Period =
  | "Today"
  | "Yesterday"
  | "Last 3 days"
  | "Past week"
  | "This Week"
  | "Past two weeks"
  | "Previous month";

export const offsets = {
  Today: 0,
  Yesterday: 1,
  "Last 3 days": 3,
  "Past week": 1,
  "This Week": 0,
  "Past two weeks": 2,
  "Previous month": 1,
} as const;

export const routes = {
  Today: "daily",
  Yesterday: "daily",
  "Last 3 days": "daily",
  "Past week": "weekly",
  "This Week": "weekly",
  "Past two weeks": "weekly",
  "Previous month": "monthly",
} as const;
