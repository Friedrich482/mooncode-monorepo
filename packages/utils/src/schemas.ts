import z from "zod";

export const JWTDto = z.object({
  sub: z.string().ulid(),
  username: z.string().min(2),
  iat: z.number().int(),
  exp: z.number().int(),
});
