import { dateStringDto } from "@repo/utils/schemas";
import { z } from "zod";

export const CreateDailyDataDto = z.object({
  targetedDate: dateStringDto,
  userId: z.string().ulid(),
  timeSpent: z.number().int().positive(),
});

export const findOneDailyDataDto = z.object({
  date: dateStringDto,
  userId: z.string().ulid(),
});

export const UpdateDailyDataDto = CreateDailyDataDto;

export const FindRangeDailyDataDto = z.object({
  userId: z.string().ulid(),
  start: dateStringDto,
  end: dateStringDto,
});

export type CreateDailyDataDtoType = z.infer<typeof CreateDailyDataDto>;

export type UpdateDailyDataDtoType = z.infer<typeof UpdateDailyDataDto>;

export type FindOneDailyDataDtoType = z.infer<typeof findOneDailyDataDto>;

export type FindRangeDailyDataDtoType = z.infer<typeof FindRangeDailyDataDto>;
