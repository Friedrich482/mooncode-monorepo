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

export const globalStateInitialDataSchema = z.object({
  timeSpentToday: z.number(),
  timeSpentPerLanguage: z.record(z.string(), z.number()),
  date: z.date(),
});

export type LanguagesData = Record<string, LanguageData>;

export type JwtPayloadType = z.infer<typeof JWTDto>;
