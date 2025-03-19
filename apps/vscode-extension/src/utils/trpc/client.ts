import * as vscode from "vscode";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc/router";
import getToken from "../auth/getToken";
import { transformer } from "@repo/trpc/transformer";

const client = (context: vscode.ExtensionContext) => {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/trpc",
        async headers() {
          return {
            authorization: await getToken(context),
          };
        },
      }),
    ],
    transformer,
  });
};
export default client;
