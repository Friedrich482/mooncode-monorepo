import { dateStringDto } from "@repo/utils/schemas";
import { z } from "zod";

export const UpsertFilesDto = z.object({
  timeSpentPerProject: z.record(z.string(), z.number().int().nonnegative()),
  filesData: z.record(
    z.string(),
    z.object({
      timeSpent: z.number().int().positive(),
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

export const BaseDto = z.object({
  start: dateStringDto,
  end: dateStringDto,
});

export type UpsertFilesStatsDtoType = z.infer<typeof UpsertFilesDto>;
export type DayFilesStatsDtoType = z.infer<typeof DayFilesStatsDto>;
export type BaseDtoType = z.infer<typeof BaseDto> & { userId: string };
