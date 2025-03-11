import * as trpcExpress from "@trpc/server/adapters/express";
import { INestApplication, Injectable } from "@nestjs/common";
import { TrpcService, createContext } from "./trpc.service";

@Injectable()
export class TrpcRouter {
  constructor(private readonly trpcService: TrpcService) {}
  appRouter = this.trpcService.trpc.router({
    // put all other routers here
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
