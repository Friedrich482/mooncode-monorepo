import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./components/Footer";
import Header from "./components/header/Header";
import Main from "./components/dashboard-page/Main";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./components/themeProvider";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc";
import { useState } from "react";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
        }),
      ],
    }),
  );
  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <ThemeProvider>
            <Header />
            <Main />
            <Footer />
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}

export default App;
