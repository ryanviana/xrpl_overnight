import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { GlobalStateProvider } from "~~/context/GlobalStateContext";
import "~~/styles/globals.css";

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextNProgress />
      <GlobalStateProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="relative flex flex-col flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </GlobalStateProvider>
    </>
  );
};

export default ScaffoldEthApp;
