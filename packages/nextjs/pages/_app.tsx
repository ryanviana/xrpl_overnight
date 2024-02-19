import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { WalletEntryPosition } from "@particle-network/auth";
import { AvalancheTestnet } from "@particle-network/chains";
import { evmWallets } from "@particle-network/connect";
import { ModalProvider } from "@particle-network/connect-react-ui";
import "@particle-network/connectkit/dist/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { GlobalStateProvider } from "~~/context/GlobalStateContext";
import "~~/styles/globals.css";

const AvalancheOvernight = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <>
      <ModalProvider
        options={{
          projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID as string,
          clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY as string,
          appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID as string,
          chains: [AvalancheTestnet],
          particleWalletEntry: {
            displayWalletEntry: true, //display wallet button when connect particle success.
            defaultWalletEntryPosition: WalletEntryPosition.BR, // BR = Circle opens on bottom right
            supportChains: [AvalancheTestnet],
          },
        }}
        theme={"auto"}
        walletSort={["Particle Auth", "Wallet"]} // Wallet order
      >
        <NextNProgress />
        <GlobalStateProvider>
          <div className="flex">
            {router.pathname !== "/" && <Header />}
            <div
              className="flex flex-col flex-1 min-h-screen"
              style={{ marginLeft: router.pathname !== "/" ? "300px" : "0" }}
            >
              <main className="relative flex flex-col flex-1">
                <Component {...pageProps} />
              </main>
              <Footer />
            </div>
          </div>
        </GlobalStateProvider>
      </ModalProvider>
    </>
  );
};

export default AvalancheOvernight;
