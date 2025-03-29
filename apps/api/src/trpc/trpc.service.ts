import * as trpcExpress from "@trpc/server/adapters/express";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TRPCError, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { EnvService } from "src/env/env.service";
import { JwtPayload } from "src/types";
import { JwtService } from "@nestjs/jwt";
import superjson from "superjson";

type TrpcContext = CreateExpressContextOptions & {
  user?: Pick<JwtPayload, "sub" | "username">;
};
export const createContext = async (
  opts: trpcExpress.CreateExpressContextOptions,
) => {
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
          user: { sub: payload.sub, username: payload.username },
        },
      });
    });
    return procedure;
  }

  async getPayload(ctx: TrpcContext) {
    // get bearer from headers
    const accessToken =
      ctx.req.headers.authorization?.replace("Bearer ", "") || "";

    if (!accessToken) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
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
