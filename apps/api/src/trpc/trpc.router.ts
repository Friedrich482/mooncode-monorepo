import { Injectable } from "@nestjs/common";

@Injectable()
export class TrpcRouter {
  constructor() {}
  appRouter = this.trpcService.trpc.router({});
}

export type AppRouter = TrpcRouter[`appRouter`];
