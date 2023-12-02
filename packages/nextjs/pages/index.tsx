import Link from "next/link";
import { useGlobalState } from "../context/GlobalStateContext";
import type { NextPage } from "next";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const transactions: any[] = [
  // This array would be filled with transaction data
];

const Home: NextPage = () => {
  const { balance } = useGlobalState(); // Use the global state

  return (
    <>
      <MetaHeader />
      <div className="flex-grow bg-base-200 w-full px-8 py-12">
        <div className="flex flex-row justify-center px-12 gap-4">
          {/* Left column for transactions */}
          <div className="flex flex-col bg-base-100 w-full max-w-md px-10 py-10 text-left items-start rounded-xl">
            <h1 className="text-2xl font-bold mb-2">Extrato</h1>

            <div className="w-full border-b-2 border-gray-200 mb-4"></div>

            <div className="pl-2 mb-2">
              <h2 className="text-md">Saldo em conta</h2>
              <p className="text-lg mb-2 font-bold">{`R$ ${balance.toFixed(2).replace(".", ",")}`}</p>{" "}
              {/* Display the balance */}
            </div>

            <div className="w-full border-b-2 border-gray-200 mb-6"></div>

            <h2 className="text-xl mb-4">Últimas movimentações</h2>
            {/* List transactions here */}
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                // Render each transaction here
                <div key={index}>{/* Transaction details */}</div>
              ))
            ) : (
              <p className="text-center justify-center">Nenhuma transação</p>
            )}
          </div>

          {/* Right column for banners */}
          <div className="flex flex-col gap-4 items-center text-center w-full max-w-md">
            {/* Placeholder for the first banner */}
            <div className="h-56 w-full bg-base-100 rounded-xl flex items-center justify-center">Imagem decorativa</div>
            {/* Placeholder for the second banner */}
            <div className="h-56 w-full bg-base-100 rounded-xl flex items-center justify-center">
              <div className="px-10 py-10 flex flex-col items-center">
                <BanknotesIcon className="h-8 w-8 fill-secondary" />
                <p className="mb-2">Usar o Tesouro Direto como Garantia de Empréstimo.</p>
                <Link href="/credit-request" className="font-semibold hover:underline">
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
