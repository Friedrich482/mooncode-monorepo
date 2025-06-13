import { DatesDto } from "src/common/dto";
import { dateStringDto } from "@repo/utils/schemas";
import { z } from "zod";

export type PeriodStatsDtoType = z.infer<typeof DatesDto> & { userId: string };
export type DayStatsDtoType = z.infer<typeof DayStatsDto> & { userId: string };

export const DayStatsDto = z.object({
  dateString: dateStringDto,
});

export const UpsertLanguagesDto = z.object({
  targetedDate: dateStringDto,
  timeSpentOnDay: z.number().int(),
  timeSpentPerLanguage: z.record(z.string(), z.number()),
});

export type UpsertLanguagesDtoType = z.infer<typeof UpsertLanguagesDto>;
