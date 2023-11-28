import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const SuccessScreen: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="h-screen flex flex-col items-center text-center py-10">
        <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center lg:w-1/2 sm:w-3/4 w-3/4 rounded-xl">
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-green-500 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <h1 className="text-3xl mt-4">Empréstimo realizado com sucesso</h1>
          <div className="flex flex-col items-center text-center my-2">
            <p className="text-xl my-2 text-neutral-500">Você acabou de receber um empréstimo de</p>
            <p className="text-xl my-0">
              <b> R$ 3000,00 </b>
            </p>
          </div>
          <Link
            href="/title-selection"
            className="bg-primary hover:bg-base-200 font-large rounded-md text-sm px-20 py-2.5 my-2"
          >
            Página Inicial
          </Link>

          <Link
            href="/credit-request"
            className="bg-base-300 hover:bg-base-200 font-medium rounded-md text-sm px-10 py-2.5"
          >
            Novo empréstimo
          </Link>
        </div>
      </div>
    </>
  );
};

export default SuccessScreen;
