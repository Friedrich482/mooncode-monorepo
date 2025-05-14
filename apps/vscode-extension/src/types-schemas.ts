import { JWTDto } from "@repo/utils/schemas";
import z from "zod";

export type LanguageData = {
  elapsedTime: number;
  startTime: number;
  lastActivityTime: number;
  frozenTime: number | null;
  freezeStartTime: number | null;
  isFrozen: boolean;
};

export const globalStateInitialDataSchema = z.record(
  z.string(), // the localDateString of the day
  z.object({
    timeSpentToday: z.number(),
    timeSpentPerLanguage: z.record(z.string(), z.number()),
    updatedAt: z.union([
      z.date(),
      z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
    ]),
  }),
);

export type LanguagesData = Record<string, LanguageData>;

export type JwtPayloadType = z.infer<typeof JWTDto>;
