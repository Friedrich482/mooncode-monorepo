import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  users: t.router({ ,
    findOne: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string(),
      email: z.string(),
      username: z.string(),
      profilePicture: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
,
,
})});
export type AppRouter = typeof appRouter;

