import { PERIODS } from "./constants";
import { z } from "zod";

export const PeriodSchema = z.enum([...PERIODS]);
export type Period = z.infer<typeof PeriodSchema>;

export const IsoDateSchema = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    "Date must be in YYYY-MM-DD format",
  )
  .refine(
    (dateStr) => {
      const date = new Date(dateStr);
      const [year, month, day] = dateStr.split("-").map(Number);

      return (
        date instanceof Date &&
        !isNaN(date.getTime()) &&
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day
      );
    },
    { message: "Invalid date" },
  )
  .transform((dateStr) => new Date(dateStr));
