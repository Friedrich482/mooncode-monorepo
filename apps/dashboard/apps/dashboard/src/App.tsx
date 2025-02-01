import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import Main from "./components/dashboard-page/Main";
import { ThemeProvider } from "./components/themeProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <Header />
        <Main />
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
