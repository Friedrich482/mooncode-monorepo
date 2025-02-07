import { z } from "zod";

export const timeSpentTodaySchema = z.object({
  id: z.string().min(6),
  timeSpent: z.number().min(0),
});

export type Period =
  | "Today"
  | "Yesterday"
  | "Last 3 days"
  | "Past week"
  | "Past two weeks"
  | "Previous month";
