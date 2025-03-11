import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../api/src/@generated/server";
import Footer from "./components/Footer";
import Header from "./components/header/Header";
import Main from "./components/dashboard-page/Main";
import { TRPCProvider } from "./utils/trpc";
import { ThemeProvider } from "./components/themeProvider";
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
          url: "http://localhost:2022",
        }),
      ],
    }),
  );
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <ThemeProvider>
            <Header />
            <Main />
            <Footer />
          </ThemeProvider>
        </TRPCProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
