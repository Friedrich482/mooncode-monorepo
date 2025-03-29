import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc/router";
import getToken from "../auth/getToken";
import superjson from "superjson";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      async headers() {
        return {
          authorization: `Bearer ${await getToken()}`,
        };
      },
    }),
  ],
  transformer: superjson,
});

export default trpc;
