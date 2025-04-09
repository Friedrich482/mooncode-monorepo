import { z } from "zod";

export const CodingStatsDto = z.object({
  timeSpentToday: z.number().int(),
  timeSpentPerLanguage: z.record(z.string(), z.number()),
});

export const TimeOffsetDto = z.object({
  offset: z.number().int().max(0, "Value must be at most 0").optional(),
});

export type CodingStatsDtoType = z.infer<typeof CodingStatsDto>;

export type CodingStatsDefault = {
  userId: string;
  offset: number | undefined;
};

const dateStringDto = z.string().refine(
  (value) => {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!dateRegex.test(value)) return false;

    const [, month, day, year] = dateRegex.exec(value) || [];
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    // Check if the date is valid using Date object
    const date = new Date(yearNum, monthNum - 1, dayNum);
    const isValidDate =
      date.getFullYear() === yearNum &&
      date.getMonth() === monthNum - 1 &&
      date.getDate() === dayNum;

    return (
      monthNum >= 1 &&
      monthNum <= 12 &&
      dayNum >= 1 &&
      yearNum >= 1900 &&
      yearNum <= 2100 &&
      isValidDate
    );
  },
  { message: "String must be a valid date in MM/DD/YYYY format" },
);

export const DatesDto = z.object({
  start: dateStringDto,
  end: dateStringDto,
  // TODO remove the optionality later
  groupBy: z.enum(["days", "weeks", "months"]).optional(),
  periodResolution: z.enum(["day", "week", "month"]).optional(),
});

export type PeriodStatsDtoType = z.infer<typeof DatesDto> & { userId: string };
export type GroupBy = z.infer<typeof DatesDto>["groupBy"];
export type PeriodResolution = z.infer<typeof DatesDto>["periodResolution"];
