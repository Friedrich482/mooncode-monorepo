import { dateStringDto } from "@repo/utils/schemas";
import { z } from "zod";

export const CreateDailyDataDto = z.object({
  targetedDate: dateStringDto,
  userId: z.string().ulid(),
  timeSpent: z.number().int().positive(),
});
// TODO remove or use it it the service
export const findOneDailyDataDto = z.object({
  date: z.string().date(),
});

export const UpdateDailyDataDto = z.object({
  userId: z.string().ulid(),
  timeSpent: z.number().int().positive(),
  targetedDate: dateStringDto,
});

export type CreateDailyDataDtoType = z.infer<typeof CreateDailyDataDto>;

export type UpdateDailyDataDtoType = z.infer<typeof UpdateDailyDataDto>;
