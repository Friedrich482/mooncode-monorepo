import z from "zod";

export type LanguageData = {
  elapsedTime: number;
  startTime: number;
  lastActivityTime: number;
  frozenTime: number | null;
  freezeStartTime: number | null;
  isFrozen: boolean;
};
export type LanguagesData = Record<string, LanguageData>;
export const MAX_IDLE_TIME = 600; //seconds

export const loginResponseSchema = z.object({
  access_token: z.string().min(6),
});

export const registerResponseSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2),
  profilePicture: z.string().min(2),
});

export const failedOperationResponseSchema = z.object({
  message: z.string().min(1),
});

export const fetchInitialLanguagesDataSchema = z.object({
  timeSpentToday: z.number(),
  todayLanguages: z.array(
    z.object({ timeSpent: z.number(), languageName: z.string() })
  ),
});

export const localUrlPort = 4208;
export const localUrl = `http://localhost:${localUrlPort}`;

export let languagesData: LanguagesData = {};
