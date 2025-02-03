import { z } from "zod";

export const timeSpentTodaySchema = z.object({
  id: z.number().min(0),
  timeSpent: z.number().min(0),
});

export type Period =
  | "Today"
  | "Yesterday"
  | "Last 3 days"
  | "Past week"
  | "Past two weeks"
  | "Previous month";
