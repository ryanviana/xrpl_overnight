import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
// Import useRouter from next/router for navigation
import type { NextPage } from "next";
import { TicketIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

// Import Link from next/link

const CreditRequest: NextPage = () => {
  const [inputValue, setInputValue] = useState(""); // This state holds the input value
  const router = useRouter(); // This is used to programmatically navigate

  // This function is called whenever the input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update the state with the new value
  };

  // This function will be called when the user wants to navigate to the next page
  const handleSubmit = () => {
    // Navigate to the next page and pass the inputValue as a query parameter
    router.push({
      pathname: "/title-selection",
      query: { loanAmount: inputValue }, // Pass the inputValue as a query parameter
    });
  };

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 pb-10">
        <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center w-3/4 rounded-2xl">
          <div className="flex flex-col pb-10 pt-10">
            <Image
              src="/images/tesouro-logo.jpg"
              className="object-contain"
              height={80}
              width={80}
              alt="Tesouro Logo"
            />
          </div>

          <div className="flex flex-col items-left text-left w-1/2 pb-4">
            <h1 className="text-4xl">Empréstimo com garantia no Tesouro Direto</h1>

            <h2 className="text-2xl">Você investe no Tesouro? Esse empréstimo é para você!</h2>

            <p className="text-justify mt-0 mb-0">
              Agora você pode usar seus títulos do Tesouro Direto (Selic, IPCA+, Prefixado) para pegar um empréstimo. E
              o melhor: você pode usar seus investimentos de qualquer banco ou instituição financeira para isso!
            </p>
          </div>

          <div className="flex flex-col items-center pb-4 w-1/2 sm:wd-3/4">
            <div className="flex flex-col items-center pb-4 mb-4 bg-base-200 rounded-md focus:outline-none focus:border-blue-500 w-full">
              <span className="mt-2">Digite o valor que deseja pegar emprestado</span>
              <input
                className="px-2 pt-4 pb-2 text-center text-xl bg-base-200 focus:outline-none focus:border-blue-500 w-full"
                type="text"
                placeholder="R$0,00"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-row justify-evenly bg-base-200 px-5 py-2 w-full rounded-2xl">
              <div className="px-4 pt-4 text-left">
                <div className="flex flex-row gap-2 justify-center items-start">
                  <TicketIcon className="w-4 h-4" />
                  <p className="my-0 mx-0">Empréstimo</p>
                </div>
                <p>a partir de R$99,99</p>
              </div>
              <div className="px-4 text-left">
                <div>
                  {/* <Image src="" className="" alt="" /> */}
                  <p>Prazo</p>
                </div>

                <p>3 a 240 meses</p>
              </div>
              <div className="px-4 text-left">
                <div>
                  {/* <Image src="" className="" alt="" /> */}
                  <p>Juros</p>
                </div>

                <p>a partir de 0,5% a.m.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            {/* Wrap the input and button in a form element */}
            <form
              onSubmit={e => {
                e.preventDefault(); // Prevent the default form submission
                handleSubmit(); // Call the handleSubmit function when the form is submitted
              }}
            >
              {/* ... rest of your input code ... */}

              {/* The button to submit the form */}
              <button
                type="submit"
                className="bg-base-300 hover:bg-base-200 font-medium rounded-md text-sm px-10 py-2.5"
              >
                Solicitar empréstimo
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditRequest;
