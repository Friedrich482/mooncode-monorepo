import { z } from "zod";

export const UpsertFilesDto = z.object({});

export type UpsertFilesStatsDtoType = z.infer<typeof UpsertFilesDto>;
