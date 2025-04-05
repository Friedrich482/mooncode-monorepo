import { z } from "zod";

export const CodingStatsDto = z.object({
  timeSpentToday: z.number().int(),
  timeSpentPerLanguage: z.record(z.string(), z.number()),
});

export const TimeOffsetDto = z.object({
  offset: z.number().int().max(0, "Value must be at most 0").optional(),
});

export type CodingStatsDtoType = z.infer<typeof CodingStatsDto>;
