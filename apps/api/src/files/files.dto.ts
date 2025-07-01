import { z } from "zod";

export const CreateFileDto = z.object({
  projectId: z.string().ulid(),
  languageId: z.string().ulid(),
  path: z.string().min(1),
  name: z.string().min(1),
  timeSpent: z.number().int(),
});

export const UpdateFileDto = z.object({
  projectId: z.string().ulid(),
  languageId: z.string().ulid(),
  timeSpent: z.number().int(),
  path: z.string().min(1),
  name: z.string().min(1),
});

export const FindOneFileDto = z.object({
  languageId: z.string().ulid(),
  projectId: z.string().ulid(),
  name: z.string().min(1),
  path: z.string().min(1),
});

export type CreateFileDtoType = z.infer<typeof CreateFileDto>;

export type UpdateFileDtoType = z.infer<typeof UpdateFileDto>;

export type FindOneFileDtoType = z.infer<typeof FindOneFileDto>;
