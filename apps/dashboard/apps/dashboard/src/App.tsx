import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import Main from "./components/dashboard-page/Main";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./components/themeProvider";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <ThemeProvider>
          <Header />
          <Main />
          <Footer />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
