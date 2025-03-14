import { z } from "zod";

export const CodingDataDto = z.object({
  timeSpentToday: z.number().positive(),
  timeSpentPerLanguage: z.record(z.string(), z.number()),
});

export const TimeOffsetDto = z.number().int().positive().optional();

export type CodingDataDtoType = z.infer<typeof CodingDataDto>;
