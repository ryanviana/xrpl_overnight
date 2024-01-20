import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { GlobalStateProvider } from "~~/context/GlobalStateContext";
import "~~/styles/globals.css";

const XRPLOvernight = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextNProgress />
      <GlobalStateProvider>
        <div className="flex">
          <Header />
          <div className="flex flex-col flex-1 min-h-screen" style={{ marginLeft: "250px" }}>
            <main className="relative flex flex-col flex-1">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </div>
      </GlobalStateProvider>
    </>
  );
};

export default XRPLOvernight;
