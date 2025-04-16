import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc/router";
import Footer from "./components/Footer";
import Header from "./components/header/Header";
import Main from "./components/dashboard-page/Main";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TRPCProvider } from "./utils/trpc";
import { ThemeProvider } from "./components/themeProvider";
import getAuthToken from "./utils/getAuthToken";
import superjson from "superjson";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function App() {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
          headers() {
            let authHeaders: { Authorization?: string } = {};
            // TODO use cookies instead of localStorage
            const token = getAuthToken() ?? "";
            if (token) {
              authHeaders = {
                Authorization: `Bearer ${token}`,
              };
            }

            return authHeaders;
          },
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <Header />
          <Main />
          <Footer />
        </TRPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
