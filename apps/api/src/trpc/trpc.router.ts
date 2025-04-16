import * as trpcExpress from "@trpc/server/adapters/express";
import { INestApplication, Injectable } from "@nestjs/common";
import { TrpcService, createContext } from "./trpc.service";
import { AuthRouter } from "src/auth/auth.router";
import { CodingStatsRouter } from "src/coding-stats/coding-stats.router";
import { UsersRouter } from "src/users/users.router";

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly usersRouter: UsersRouter,
    private readonly authRouter: AuthRouter,
    private readonly codingStatsRouter: CodingStatsRouter,
  ) {}

  appRouter = this.trpcService.trpc.router({
    ...this.usersRouter.procedures,
    ...this.authRouter.procedures,
    ...this.codingStatsRouter.procedures,
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
