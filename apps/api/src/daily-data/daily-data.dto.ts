import { z } from "zod";

export const CreateDailyDataDto = z.object({
  userId: z.string().ulid(),
  timeSpent: z.number().int().positive(),
});

export const findOneDailyDataDto = z.object({
  date: z.string().date(),
});

export const UpdateDailyDataDto = z.object({
  userId: z.string().ulid(),
  timeSpent: z.number().int().positive(),
  date: z.string().date(),
});

export type CreateDailyDataDtoType = z.infer<typeof CreateDailyDataDto>;

export type UpdateDailyDataDtoType = z.infer<typeof UpdateDailyDataDto>;
