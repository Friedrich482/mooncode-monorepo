import { JWTDto } from "@repo/utils/schemas";
import { z } from "zod";

export type ExtendedRequest = Request & {
  user: {
    sub: string;
    username: string;
  };
};

export type JwtPayloadDtoType = z.infer<typeof JWTDto>;
