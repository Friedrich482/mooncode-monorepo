import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./components/Footer";
import Header from "./components/header/Header";
import Main from "./components/dashboard-page/Main";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./components/themeProvider";
import getAuthToken from "./utils/getAuthToken";
import { httpBatchLink } from "@trpc/client";
import { transformer } from "@repo/trpc/transformer";
import { trpc } from "./utils/trpc";
import { useState } from "react";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
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
        }),
      ],
      transformer,
    }),
  );
  return (
    <>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <Header />
            <Main />
            <Footer />
          </trpc.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
