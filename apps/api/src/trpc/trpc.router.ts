import * as trpcExpress from "@trpc/server/adapters/express";
import { INestApplication, Injectable } from "@nestjs/common";
import { TrpcService, createContext } from "./trpc.service";
import { AuthRouter } from "src/auth/auth.router";
import { CodingDataRouter } from "src/coding-data/coding-data.router";
import { UsersRouter } from "src/users/users.router";

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly usersRouter: UsersRouter,
    private readonly authRouter: AuthRouter,
    private readonly codingDataRouter: CodingDataRouter,
  ) {}

  appRouter = this.trpcService.trpc.router({
    ...this.usersRouter.apply(),
    ...this.authRouter.apply(),
    ...this.codingDataRouter.apply(),
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
