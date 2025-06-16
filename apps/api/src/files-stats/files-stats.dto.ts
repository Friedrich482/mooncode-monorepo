import { BaseSchema } from "src/common/dto";
import { INCOHERENT_DATE_RANGE_ERROR_MESSAGE } from "@repo/utils/constants";
import { dateStringDto } from "@repo/utils/schemas";
import getPeriodResolution from "@repo/utils/getPeriodResolution";
import { isAfter } from "date-fns";
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

export const GetProjectOnPeriodDto = BaseSchema.extend({
  name: z.string().min(1),
})
  .refine((input) => !isAfter(input.start, input.end), {
    message: INCOHERENT_DATE_RANGE_ERROR_MESSAGE,
  })
  .transform((input) => {
    //  this prevent the groupBy attribute to be "weeks" for periods like "Last 7 days", "This week" or "Last week"
    const periodResolution = getPeriodResolution(input.start, input.end);
    if (periodResolution === "day") {
      input.groupBy = "days";
    }
    if (periodResolution === "week" && input.groupBy === "months") {
      input.groupBy = "weeks";
    }
    return { ...input, periodResolution };
  });

export const GetProjectPerDayOfPeriodDto = GetProjectOnPeriodDto;
export const GetProjectLanguagesTimeOnPeriodDto = GetProjectOnPeriodDto;

export type UpsertFilesStatsDtoType = z.infer<typeof UpsertFilesDto>;
export type DayFilesStatsDtoType = z.infer<typeof DayFilesStatsDto>;
export type GetProjectOnPeriodDtoType = z.infer<
  typeof GetProjectOnPeriodDto
> & { userId: string };
export type GetProjectPerDayOfPeriodDtoType = z.infer<
  typeof GetProjectPerDayOfPeriodDto
> & { userId: string };
export type GetProjectLanguagesTimeOnPeriodType = z.infer<
  typeof GetProjectLanguagesTimeOnPeriodDto
> & { userId: string };
