import { z } from "zod";

export const timeSpentTodaySchema = z.object({
  id: z.number().min(0),
  timeSpent: z.number().min(0),
});
