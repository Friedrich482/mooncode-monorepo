import * as trpcExpress from "@trpc/server/adapters/express";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TRPCError, initTRPC } from "@trpc/server";
import { EnvService } from "src/env/env.service";
import { JwtPayloadDtoType } from "src/types";
import { JwtService } from "@nestjs/jwt";
import superjson from "superjson";

export type TrpcContext = {
  req: trpcExpress.CreateExpressContextOptions["req"];
  res: trpcExpress.CreateExpressContextOptions["res"];
  user?: Pick<JwtPayloadDtoType, "sub">;
};

export const createContext = async (
  opts: trpcExpress.CreateExpressContextOptions,
): Promise<TrpcContext> => {
  return {
    req: opts.req,
    res: opts.res,
  };
};

@Injectable()
export class TrpcService {
  trpc;
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {
    this.trpc = initTRPC
      .context<TrpcContext>()
      .create({ transformer: superjson });
  }

  // these routes are publicly accessible to everyone
  publicProcedure() {
    return this.trpc.procedure;
  }

  // these routes requires authentication:

  protectedProcedure() {
    const procedure = this.trpc.procedure.use(async (opts) => {
      const payload = await this.getPayload(opts.ctx);

      if (!payload) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      // user is authorized
      return opts.next({
        ctx: {
          ...opts.ctx,
          user: { sub: payload.sub },
        },
      });
    });
    return procedure;
  }

  async getPayload(ctx: TrpcContext) {
    // get jwt token from cookies (browser) or the headers (extension)
    const accessToken =
      ctx.req.cookies?.auth_token ??
      (ctx.req.headers.authorization?.replace("Bearer ", "") || "");

    if (!accessToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Auth token cookie missing",
      });
    }

    try {
      const payload: JwtPayloadDtoType = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: this.envService.get("JWT_SECRET"),
        },
      );
      return payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(error);
    }
  }
}
