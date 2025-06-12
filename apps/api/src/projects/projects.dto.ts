import { z } from "zod";

export const CreateProjectDto = z.object({
  dailyDataId: z.string().ulid(),
  name: z.string(),
  path: z.string(),
  timeSpent: z.number().int().positive(),
});

export const UpdateProjectDto = z.object({
  dailyDataId: z.string().ulid(),
  timeSpent: z.number().int().positive(),
  name: z.string(),
  path: z.string(),
});

export const FindProjectDto = z.object({
  dailyDataId: z.string().ulid(),
  name: z.string(),
  path: z.string(),
});

export type CreateProjectDtoType = z.infer<typeof CreateProjectDto>;
export type UpdateProjectDtoType = z.infer<typeof UpdateProjectDto>;
export type FindProjectDtoType = z.infer<typeof FindProjectDto>;
