import {
  BaseSchema,
  DateRangeSchema,
  UserId,
  refineAndTransformSchema,
  refineSchema,
} from "src/common/dto";
import { dateStringDto } from "@repo/common/schemas";
import { z } from "zod";

export const GetDailyFilesStatsForExtensionDto = z.object({
  dateString: dateStringDto,
});

export const UpsertFilesDto = z.object({
  timeSpentPerProject: z.record(
    z.string().min(1),
    z.number().int().nonnegative(),
  ),
  filesData: z.record(
    z.string().min(1),
    z.object({
      timeSpent: z.number().int().nonnegative(),
      languageSlug: z.string().min(1),
      projectName: z.string().min(1),
      projectPath: z.string().min(1),
      fileName: z.string().min(1),
    }),
  ),
  targetedDate: dateStringDto,
});

export const GetPeriodProjectsDto = refineSchema(DateRangeSchema);

export const GetProjectOnPeriodDto = refineSchema(
  DateRangeSchema.merge(
    z.object({
      name: z.string().min(1),
    }),
  ),
);

export const GetProjectPerDayOfPeriodDto = refineAndTransformSchema(
  BaseSchema.merge(z.object({ name: z.string().min(1) })),
);
export const GetProjectLanguagesTimeOnPeriodDto = GetProjectOnPeriodDto;
export const GetProjectLanguagesPerDayOfPeriodDto = GetProjectPerDayOfPeriodDto;
export const GetProjectFilesOnPeriodDto = refineSchema(
  DateRangeSchema.extend({
    name: z.string().min(1),
    amount: z.number().int().positive().optional(),
    languages: z.array(z.string().min(1)).optional(),
  }),
);

export type GetDailyFilesStatsForExtensionDtoType = z.infer<
  typeof GetDailyFilesStatsForExtensionDto
> &
  UserId;

export type UpsertFilesStatsDtoType = z.infer<typeof UpsertFilesDto> & UserId;

export type GetPeriodProjectsDtoType = z.infer<typeof GetPeriodProjectsDto> &
  UserId;

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
