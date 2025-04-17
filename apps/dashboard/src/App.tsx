import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc/router";
import Dashboard from "./components/dashboard-page/Dashboard";
import Layout from "./components/layout/Layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Root from "./components/root-page/Root";
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
          url: import.meta.env.VITE_API_URL,
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
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Root />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </TRPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
