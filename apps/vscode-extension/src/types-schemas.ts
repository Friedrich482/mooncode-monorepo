import { JWTDto } from "@repo/utils/schemas";
import z from "zod";

export type LanguageData = {
  elapsedTime: number;
  startTime: number;
  lastActivityTime: number;
  frozenTime: number | null; // this is an accumulator of time to track the elapsedTime when the language is frozen
  freezeStartTime: number | null;
  isFrozen: boolean;
};

export type FileData = {
  elapsedTime: number;
  startTime: number;
  lastActivityTime: number;
  frozenTime: number | null; // this is an accumulator of time to track the elapsedTime when the language is frozen
  freezeStartTime: number | null;
  isFrozen: boolean;
  projectName: string;
  projectPath: string;
  language: string;
};

export const globalStateInitialDataSchema = z.object({
  lastServerSync: z.union([
    z.date(),
    z
      .string()
      .datetime()
      .transform((str) => new Date(str)),
  ]),
  dailyData: z.record(
    z.string(), // the localDateString of the day
    z.object({
      timeSpentOnDay: z.number(),
      timeSpentPerLanguage: z.record(z.string(), z.number()),
      updatedAt: z.union([
        z.date(),
        z
          .string()
          .datetime()
          .transform((str) => new Date(str)),
      ]),
    }),
  ),
});
export type LanguageMap = Record<string, LanguageData>;
export type FileMap = Record<string, FileData>;

export type JwtPayloadType = z.infer<typeof JWTDto>;
