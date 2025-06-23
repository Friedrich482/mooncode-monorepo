import { BaseSchema, UserId, refineAndTransformSchema } from "src/common/dto";
import { dateStringDto } from "@repo/utils/schemas";
import { z } from "zod";

export const UpsertFilesDto = z.object({
  timeSpentPerProject: z.record(z.string(), z.number().int().nonnegative()),
  filesData: z.record(
    z.string(),
    z.object({
      timeSpent: z.number().int().nonnegative(),
      language: z.string().min(1),
      projectName: z.string().min(1),
      projectPath: z.string().min(1),
    }),
  ),
  targetedDate: dateStringDto,
});

export const DayFilesStatsDto = z.object({
  dateString: dateStringDto,
});

export const GetProjectOnPeriodDto = refineAndTransformSchema(
  BaseSchema.extend({
    name: z.string().min(1),
  }),
);

export const GetProjectPerDayOfPeriodDto = GetProjectOnPeriodDto;
export const GetProjectLanguagesTimeOnPeriodDto = GetProjectOnPeriodDto;
export const GetProjectLanguagesPerDayOfPeriodDto = GetProjectOnPeriodDto;
export const GetProjectFilesOnPeriodDto = refineAndTransformSchema(
  BaseSchema.extend({
    name: z.string().min(1),
    amount: z.number().int().positive().optional(),
    languages: z.array(z.string().min(1)).optional(),
  }),
);

export type UpsertFilesStatsDtoType = z.infer<typeof UpsertFilesDto>;
export type DayFilesStatsDtoType = z.infer<typeof DayFilesStatsDto>;
export type GetProjectOnPeriodDtoType = z.infer<typeof GetProjectOnPeriodDto> &
  UserId;
export type GetProjectPerDayOfPeriodDtoType = z.infer<
  typeof GetProjectPerDayOfPeriodDto
> &
  UserId;
export type GetProjectLanguagesTimeOnPeriodType = z.infer<
  typeof GetProjectLanguagesTimeOnPeriodDto
> &
  UserId;
export type GetProjectLanguagesPerDayOfPeriodDtoType = z.infer<
  typeof GetProjectLanguagesPerDayOfPeriodDto
> &
  UserId;
export type GetProjectFilesOnPeriodDtoType = z.infer<
  typeof GetProjectFilesOnPeriodDto
> &
  UserId;
