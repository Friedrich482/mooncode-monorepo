import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc/router";
import getToken from "../auth/getToken";
import { transformer } from "@repo/trpc/transformer";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      async headers() {
        return {
          authorization: await getToken(),
        };
      },
    }),
  ],
  transformer,
});

export default trpc;
