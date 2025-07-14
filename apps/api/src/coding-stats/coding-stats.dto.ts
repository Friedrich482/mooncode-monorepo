import {
  BaseSchema,
  DateRangeSchema,
  UserId,
  refineAndTransformSchema,
  refineSchema,
} from "src/common/dto";
import { dateStringDto } from "@repo/common/schemas";
import { z } from "zod";

export const GetDailyStatsForExtensionDto = z.object({
  dateString: dateStringDto,
});

export const UpsertLanguagesDto = z.object({
  targetedDate: dateStringDto,
  timeSpentOnDay: z.number().int(),
  timeSpentPerLanguage: z.record(z.string().min(1), z.number().int()),
});

export const GetTimeSpentOnPeriodDto = refineSchema(DateRangeSchema);

export const GetDaysOfPeriodStatsDto = refineAndTransformSchema(BaseSchema);

export const GetPeriodLanguagesTimeDto = GetTimeSpentOnPeriodDto;

export const GetPeriodLanguagesPerDayDto = GetDaysOfPeriodStatsDto;

export const GetDailyStatsForChartDto = GetDailyStatsForExtensionDto;

export const GetPeriodGeneralStatsDto = GetDaysOfPeriodStatsDto;

export type GetDailyStatsForExtensionDtoType = z.infer<
  typeof GetDailyStatsForExtensionDto
> &
  UserId;

export type UpsertLanguagesDtoType = z.infer<typeof UpsertLanguagesDto> &
  UserId;

export type GetTimeSpentOnPeriodDtoType = z.infer<
  typeof GetTimeSpentOnPeriodDto
> &
  UserId;

export type GetDaysOfPeriodStatsDtoType = z.infer<
  typeof GetDaysOfPeriodStatsDto
> &
  UserId;

export type GetPeriodLanguagesTimeDtoType = z.infer<
  typeof GetPeriodLanguagesTimeDto
> &
  UserId;

export type GetPeriodLanguagesPerDayDtoType = z.infer<
  typeof GetPeriodLanguagesPerDayDto
> &
  UserId;

export type GetDailyStatsForChartDtoType = z.infer<
  typeof GetDailyStatsForChartDto
> &
  UserId;

export type GetPeriodGeneralStatsDtoType = z.infer<
  typeof GetPeriodGeneralStatsDto
> &
  UserId;
