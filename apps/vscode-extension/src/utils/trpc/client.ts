import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc/router";
import { PROD_API_URL } from "../../constants";
import dotenv from "dotenv";
import getToken from "../auth/getToken";
import path from "path";
import superjson from "superjson";

// get the API_URL for development,
dotenv.config({ path: path.join(__dirname, "../.env") });

const getApiURL = () => {
  return process.env.API_URL || PROD_API_URL;
};

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getApiURL(),
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
