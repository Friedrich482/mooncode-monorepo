import { z } from "zod";

export const dailyPeriodSchema = z.object({
  timeSpent: z.number().min(0),
  dayLanguagesTime: z.record(z.string().min(1), z.number().min(0)),
});

export const weeklyPeriodSchema = z.object({
  timeSpent: z.number().min(0),
  weekLanguagesTime: z.record(z.string().min(1), z.number().min(0)),
  daysOfWeekStats: z.record(
    z.string().min(2),
    z.object({
      timeSpent: z.number().min(0),
      languages: z.record(z.string().min(1), z.number().min(0)),
    }),
  ),
});

export type Week = z.infer<typeof weeklyPeriodSchema>;

export type Period =
  | "Today"
  | "Yesterday"
  | "Last 3 days"
  | "Past week"
  | "This week"
  | "Past 2 weeks"
  | "Previous month"
  | "This month";

export const periodConfig = {
  Today: {
    offset: 0,
    route: "daily",
    schema: dailyPeriodSchema,
  },
  Yesterday: {
    offset: 1,
    route: "daily",
    schema: dailyPeriodSchema,
  },
  "Last 3 days": {
    offset: 3,
    route: "daily",
    schema: dailyPeriodSchema,
  },
  "Past week": {
    offset: 1,
    route: "weekly",
    schema: weeklyPeriodSchema,
  },
  "This week": {
    offset: 0,
    route: "weekly",
    schema: weeklyPeriodSchema,
  },
  "Past 2 weeks": {
    offset: 2,
    route: "weekly",
    schema: weeklyPeriodSchema,
  },
  "This month": {
    offset: 0,
    route: "monthly",
    schema: weeklyPeriodSchema,
  },
  "Previous month": {
    offset: 1,
    route: "monthly",
    schema: weeklyPeriodSchema,
  },
} as const;
