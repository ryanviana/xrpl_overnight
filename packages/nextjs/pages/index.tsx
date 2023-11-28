import Link from "next/link";
import { ScaleIcon } from "lucide-react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex-grow flex-col bg-base-200 justify-center w-full px-8 py-12">
        <div className="flex flex-row justify-center px-12 gap-4">
          <div className="flex flex-col bg-base-100 w-96 px-10 py-10 text-left items-left rounded-xl">
            <h1 className="text-2xl font-bold">Extrato</h1>
            <h2 className="text-md">Saldo em conta</h2>
            <h2 className="text-xl">Últimas movimentações</h2>
          </div>
          <div className="flex flex-col gap-4 items-center text-center ">
            <div className="flex flex-col h-56 w-96 items-center text-center bg-base-100 rounded-xl">
              Banner promovendo o banco
            </div>
            <div className="flex flex-col h-56 w-96 items-center text-center bg-base-100 rounded-xl">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center rounded-xl">
                <ScaleIcon className="h-8 w-8 fill-secondary" />
                <p>Usar o Tesouro Direto como Garantia de Empréstimo.</p>
                <Link href="/credit-request" passHref className="link">
                  Clique aqui!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
