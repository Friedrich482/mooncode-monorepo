import * as trpcExpress from "@trpc/server/adapters/express";
import { INestApplication, Injectable } from "@nestjs/common";
import { TrpcService, createContext } from "./trpc.service";
import { UsersRouter } from "src/users/users.router";

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly usersRouter: UsersRouter,
  ) {}

  appRouter = this.trpcService.trpc.router({
    ...this.usersRouter.apply(),
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
