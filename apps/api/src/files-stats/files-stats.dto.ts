import { dateStringDto } from "@repo/utils/schemas";
import { z } from "zod";

export const UpsertFilesDto = z.record(
  z.string(),
  z.object({
    timeSpent: z.number(),
    language: z.string(),
    projectName: z.string(),
    projectPath: z.string(),
  }),
);

export const DayFilesStatsDto = z.object({
  dateString: dateStringDto,
});

export type UpsertFilesStatsDtoType = z.infer<typeof UpsertFilesDto>;
export type DayFilesStatsDtoType = z.infer<typeof DayFilesStatsDto> & {
  userId: string;
};
