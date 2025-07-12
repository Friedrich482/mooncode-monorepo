import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { API_URL } from "../../constants";
import type { AppRouter } from "@repo/trpc/router";
import getToken from "../auth/getToken";
import superjson from "superjson";

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: API_URL,
      async headers() {
        return {
          authorization: `Bearer ${await getToken()}`,
        };
      },
      transformer: superjson,
    }),
  ],
});

export default trpc;
