import { z } from "zod";

export const CreateFileDto = z.object({
  projectId: z.string().ulid(),
  dailyDataId: z.string().ulid(),
  languageId: z.string().ulid(),
  path: z.string(),
  fileName: z.string(),
  timeSpent: z.number().int(),
});

export const UpdateFileDto = z.object({
  projectId: z.string().ulid(),
  dailyDataId: z.string().ulid(),
  timeSpent: z.number().int(),
  path: z.string(),
  fileName: z.string(),
});

export type CreateFileDtoType = z.infer<typeof CreateFileDto>;

export type UpdateFileDtoType = z.infer<typeof UpdateFileDto>;
