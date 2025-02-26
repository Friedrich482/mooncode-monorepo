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
  timeSpent: z.number(),
  dayLanguagesTime: z.record(z.string().min(1), z.number().min(0)),
});
