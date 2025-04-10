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
export type LanguagesData = Record<string, LanguageData>;

export const loginResponseSchema = z.object({
  result: z.object({
    data: z.object({
      access_token: z.string().jwt(),
    }),
  }),
});

export type JwtPayloadType = z.infer<typeof JWTDto>;
