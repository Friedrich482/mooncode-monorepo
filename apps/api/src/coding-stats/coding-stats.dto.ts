import { z } from "zod";

export const CodingStatsDto = z.object({
  timeSpentToday: z.number().int(),
  timeSpentPerLanguage: z.record(z.string(), z.number()),
});

export const TimeOffsetDto = z.object({
  offset: z.number().int().max(0, "Value must be at most 0").optional(),
});

export type CodingStatsDtoType = z.infer<typeof CodingStatsDto>;

export type CodingStatsDefault = {
  userId: string;
  offset: number | undefined;
};

// TODO make the date validation more robust
export const DatesDto = z.object({
  start: z.string(),
  end: z.string(),
});

export type PeriodStatsDtoType = z.infer<typeof DatesDto> & { userId: string };
