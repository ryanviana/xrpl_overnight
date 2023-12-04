import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useGlobalState } from "~~/context/GlobalStateContext";
import CredpixJSON from "~~/utils/Credpix.json";

// Define the type for the inputValues state
type InputValuesType = {
  [key: string]: string;
};
const TitleSelection: NextPage = () => {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(""); // State to hold the loan amount
  const [inputValues, setInputValues] = useState<InputValuesType>({}); // State to hold all input values
  const [isLoading, setIsLoading] = useState(false); // New state for loading status

  useEffect(() => {
    // If the page has finished loading and the router is ready
    if (router.isReady) {
      // Retrieve the loan amount from the query and set it to the state
      const queryLoanAmount = router.query.loanAmount as string;
      setLoanAmount(queryLoanAmount);
    }
  }, [router.isReady, router.query.loanAmount]); // Dependency array

  // Function to handle the input change and store the value
  const handleInputChange = (index: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValues(prevValues => ({
      ...prevValues,
      [index]: value,
    }));
  };

  async function creditOperation(
    investorAddress: string,
    TPFtAddress: string,
    BRLAmount: string,
    contractAddress: string,
    abi: any,
  ) {
    // Carregar a chave privada do arquivo .env
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    console.log("Chave privada:", privateKey);
    if (privateKey == null) {
      throw new Error("Chave privada não definida no .env");
    }

    // Configurar o provedor e a carteira
    const provider = new ethers.providers.JsonRpcProvider(
      "https://solemn-spring-model.matic-testnet.quiknode.pro/093e82e684aba9fe5675ccb677bdb8d98c217239/",
    );

    const wallet = new ethers.Wallet(privateKey, provider);

    // Criar uma instância do contrato
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // Chamar a função creditOperation do contrato
    try {
      const transaction = await contract.creditOperation(investorAddress, TPFtAddress, BRLAmount);

      // Aguardar a confirmação da transação
      await transaction.wait();
      console.log("Operação de crédito realizada com sucesso");
    } catch (error) {
      console.error("Erro ao realizar operação de crédito:", error);
    }
  }

  // Function to handle navigation to the success screen
  const navigateToSuccessScreen = async (
    investorAddress: string,
    TPFtAddress: string,
    BRLAmount: string, // Agora recebe BRLAmount como parâmetro
    contractAddress: string,
    contractAbi: any,
  ) => {
    incrementBalance(totalValueUsed); // Incrementa o saldo global
    setIsLoading(true); // Disable navigation by setting isLoading to true

    // Chama a função creditOperation com os parâmetros fornecidos
    try {
      await creditOperation(
        investorAddress, // Endereço do investidor
        TPFtAddress, // Endereço do TPFt
        BRLAmount, // Valor em BRL
        contractAddress, // Endereço do contrato
        contractAbi, // ABI do contrato
      );
      console.log("Operação de crédito realizada com sucesso.");

      // Aqui você pode adicionar código para salvar os dados no banco de dados
    } catch (error) {
      console.error("Erro na operação de crédito:", error);
    }

    setIsLoading(false); // Re-enable navigation by setting isLoading to false

    // Navega para a tela de sucesso com totalValueUsed como parâmetro de consulta
    router.push({
      pathname: "/success-screen",
      query: { totalValueUsed: totalValueUsed.toFixed(2) }, // Passando o valor total
    });
  };

  // Calculate the sum of all input values, ensuring each value is a number
  const totalValueUsed = Object.values(inputValues).reduce((sum, value) => {
    const numericValue = parseFloat(value);
    return sum + (isNaN(numericValue) ? 0 : numericValue); // Only add if it's a number
  }, 0);

  const { incrementBalance } = useGlobalState(); // Use the global state increment function

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col flex-grow bg-base-300 items-center py-10">
        <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center w-3/4 rounded-xl">
          <div className="flex flex-row py-4 justify-between w-full px-10">
            <div className="flex flex-col items-start text-left">
              <h1 className="text-4xl mb-0">Títulos do Tesouro Direto para utilizar</h1>

              <p className="text-2xl my-2 text-zinc-500">Selecione títulos para deixar como garantia do empréstimo</p>
            </div>

            <div className="flex flex-col items-end text-right">
              <button
                disabled={isLoading} // Disable the button based on isLoading state
                onClick={() =>
                  navigateToSuccessScreen(
                    "0x1f3dF98BECEE560181Cdf114217cc6f1cc54217f",
                    "0x70fDD8DD7A09F6d6F7460777a631875c39d7bfCD",
                    totalValueUsed.toString() + "00",
                    "0x9f94816D0F3E95D14D9396aB497FCAF91829076E",
                    CredpixJSON.abi,
                  )
                }
                className={`bg-base-300 hover:bg-base-200 font-medium rounded-md text-sm px-10 py-2.5 ${
                  isLoading ? "opacity-50" : ""
                }`}
              >
                {isLoading ? "Processando..." : "Feito"}
              </button>
            </div>
          </div>

          <div className="flex flex-col py-2 w-full px-10">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Título
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Instituição
                        <Link href="#">
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </Link>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Rentabilidade anual
                        <Link href="#">
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </Link>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Saldo
                        <Link href="#">
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </Link>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Valor a utilizar
                        <Link href="#">
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </Link>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map over a list of titles to create table rows */}
                  {["Tesouro Prefixado 2026", "Tesouro IPCA+ 2032", "Tesouro Selic 2029"].map((title, index) => (
                    <tr key={title} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {title}
                      </th>
                      <td className="px-6 py-4">Banco do Brasil</td>
                      <td className="px-6 py-4">10,6%</td>
                      <td className="px-6 py-4">R$ 1000,00</td>
                      <td className="px-6 py-4 text-right">
                        <input
                          className="px-2 py-2 text-left focus:outline-none focus:border-blue-500 w-full"
                          type="number"
                          placeholder="R$0,00"
                          value={inputValues[`value-${index}`] || ""} // Use dynamic keys for inputValues
                          onChange={handleInputChange(`value-${index}`)} // Pass a unique key for each input
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200 dark:bg-gray-800">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div>
                        <p>Empréstimo desejado</p>
                        <p className="">Valor usado como garantia</p>
                      </div>
                    </th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-right">
                      <div>
                        <p>{loanAmount ? `R$ ${loanAmount}` : "R$ 0,00"}</p>
                        {/* Display the sum of values */}
                        <p>R$ {totalValueUsed.toFixed(2)}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TitleSelection;
