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

export type UpsertFilesStatsDtoType = z.infer<typeof UpsertFilesDto>;
