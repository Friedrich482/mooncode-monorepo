import { DatesDto, UserId } from "src/common/dto";
import { dateStringDto } from "@repo/utils/schemas";
import { z } from "zod";

export const DayStatsDto = z.object({
  dateString: dateStringDto,
});

export const UpsertLanguagesDto = z.object({
  targetedDate: dateStringDto,
  timeSpentOnDay: z.number().int(),
  timeSpentPerLanguage: z.record(z.string().min(1), z.number().int()),
});

export type PeriodStatsDtoType = z.infer<typeof DatesDto> & UserId;
export type DayStatsDtoType = z.infer<typeof DayStatsDto> & UserId;
export type UpsertLanguagesDtoType = z.infer<typeof UpsertLanguagesDto>;
