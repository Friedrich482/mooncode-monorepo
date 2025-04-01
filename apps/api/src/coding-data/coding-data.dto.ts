import { z } from "zod";

export const CodingDataDto = z.object({
  timeSpentToday: z.number().int(),
  timeSpentPerLanguage: z.record(z.string(), z.number()),
});

export const TimeOffsetDto = z.object({
  offset: z.number().int().max(0, "Value must be at most 0").optional(),
});

export type CodingDataDtoType = z.infer<typeof CodingDataDto>;
