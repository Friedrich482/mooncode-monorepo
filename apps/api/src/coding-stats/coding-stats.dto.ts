import { z } from "zod";

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

export const DatesDto = z
  .object({
    start: dateStringDto,
    end: dateStringDto,
    // TODO remove the optionality later
    groupBy: z.enum(["days", "weeks", "months"]).optional(),
    periodResolution: z.enum(["day", "week", "month"]).optional(),
  })
  //  this prevent the groupBy attribute to be "weeks" for periods like "Last 7 days", "This week" or "Last week"
  .transform((input) => {
    if (input?.periodResolution === "day") {
      input.groupBy = "days";
    }
    return input;
  });

export type PeriodStatsDtoType = z.infer<typeof DatesDto> & { userId: string };
export type GroupBy = z.infer<typeof DatesDto>["groupBy"];
export type PeriodResolution = z.infer<typeof DatesDto>["periodResolution"];

export const DayStatsDto = z.object({
  dateString: dateStringDto,
});

export type DayStatsDtoType = z.infer<typeof DayStatsDto> & { userId: string };

// TODO INVESTIGATE THIS
export const CodingStatsDto = z.object({
  timeSpentToday: z.number().int(),
  timeSpentPerLanguage: z.record(z.string(), z.number()),
});

export type CodingStatsDtoType = z.infer<typeof CodingStatsDto>;
