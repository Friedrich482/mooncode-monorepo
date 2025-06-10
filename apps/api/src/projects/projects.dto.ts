import { z } from "zod";

export const CreateProjectDto = z.object({
  userId: z.string().ulid(),
  projectName: z.string(),
  path: z.string(),
});

export const UpdateProjectDto = CreateProjectDto.partial();

export type CreateProjectDtoType = z.infer<typeof CreateProjectDto>;
export type UpdateProjectDtoType = z.infer<typeof UpdateProjectDto>;
