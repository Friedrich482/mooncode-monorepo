import * as trpcExpress from "@trpc/server/adapters/express";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TRPCError, initTRPC } from "@trpc/server";
import { ConfigService } from "@nestjs/config";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/drizzle/schema/users";
import { UsersService } from "src/users/users.service";
import { transformer } from "@repo/trpc/src/transformer";
export type TrpcContext = CreateExpressContextOptions & {
  user?: User;
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
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.trpc = initTRPC.context<TrpcContext>().create({
      transformer,
    });
  }

  // these routes are publicly accessible to everyone
  publicProcedure() {
    return this.trpc.procedure;
  }

  // these routes requires authentication:

  protectedProcedure() {
    const procedure = this.trpc.procedure.use(async (opts) => {
      // get bearer from headers
      const userJwt = await this.getJwtUserFromHeader(opts.ctx);
      // throw error if user is unauthorized
      if (!userJwt) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      // user is authorized
      return opts.next({
        ctx: {
          ...opts.ctx,
          user: userJwt.user,
        },
      });
    });
    return procedure;
  }

  async getJwtUserFromHeader(ctx: TrpcContext) {
    // get bearer from headers
    const accessToken =
      ctx.req.headers.authorization?.replace("Bearer ", "") || "";

    if (!accessToken) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });
      return payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(error);
    }
  }
}
