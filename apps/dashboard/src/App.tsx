import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc/router";
import { INCOHERENT_DATE_RANGE_ERROR_MESSAGE } from "@repo/utils/constants";
import { Outlet } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TRPCProvider } from "./utils/trpc";
import { ThemeProvider } from "./components/themeProvider";
import superjson from "superjson";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
        retry: (failureCount, error) => {
          try {
            const parsedErrors =
              typeof error.message === "string"
                ? JSON.parse(error.message)
                : error.message;

            if (Array.isArray(parsedErrors)) {
              const errorMessage: string = parsedErrors.map(
                (err) => err.message,
              )[0];
              if (errorMessage === INCOHERENT_DATE_RANGE_ERROR_MESSAGE) {
                return failureCount < 1;
              }
            }
            return failureCount < 0;
          } catch (error) {
            console.error(error);
            return failureCount < 3;
          }
        },
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
        // trpc reads the http only cookie
        httpBatchLink({
          url: import.meta.env.VITE_API_URL,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
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
          <Outlet />
        </TRPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
