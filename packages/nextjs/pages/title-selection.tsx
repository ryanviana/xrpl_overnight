import React, { MouseEvent, ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import Modal from "~~/components/Modal";
import { useGlobalState } from "~~/context/GlobalStateContext";
import CredpixJSON from "~~/utils/Credpix.json";
import {
  fetchTPFtByAddress,
  fetchWalletByCpfAndBank,
  findAddressByBankName,
  findTPFtByAddres,
} from "~~/utils/bacenApiFetcher";

// Define the type for the inputValues state
type InputValuesType = {
  [key: string]: string;
};

const TitleSelection: NextPage = () => {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(""); // State to hold the loan amount
  const [inputValues, setInputValues] = useState<InputValuesType>({}); // State to hold all input values
  const [isLoading, setIsLoading] = useState(false); // New state for loading status
  const [currentValue, setCurrentValue] = useState(0); // State to hold the current value of the Selic title
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Define an async function to fetch and filter data
    const fetchDataAndFilter = async () => {
      // If the page has finished loading and the router is ready
      if (router.isReady) {
        // Retrieve the loan amount from the query and set it to the state
        const queryLoanAmount = router.query.loanAmount as string;
        setLoanAmount(queryLoanAmount);

        const cpf = "11640141619"; // CPF do usuário
        const bankName = "RGBank"; // Nome do banco do usuário
        try {
          const walletData = await fetchWalletByCpfAndBank(cpf);
          const walletAddresses = await findAddressByBankName(walletData, bankName); // Use await here
          const walletAddress = walletAddresses[0];
          const tpfts = await fetchTPFtByAddress();
          const addressTPFts = await findTPFtByAddres(tpfts, walletAddress); // Use await here
          setCurrentValue(addressTPFts.value.current);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchDataAndFilter(); // Call the async function to fetch and filter data
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

  const loanData = [
    {
      institution: "Banco ABC",
      amount: "10000",
      title: "Tesouro Selic 2029",
      date: "2022-01-01T23:00:00",
      totalBorrowed: "1000",
    },
    {
      institution: "Banco DEF",
      amount: "20000",
      title: "Tesouro Selic 2027",
      date: "2022-01-01T22:30:00",
      totalBorrowed: "1000",
    },
    {
      institution: "Banco GHI",
      amount: "30000",
      title: "Tesouro Selic 2028",
      date: "2022-01-01T22:00:00",
      totalBorrowed: "1000",
    },
    {
      institution: "Banco JKL",
      amount: "10000",
      title: "Tesouro Selic 2029",
      date: "2022-01-01T21:30:00",
      totalBorrowed: "1000",
    },
    {
      institution: "Banco MNO",
      amount: "20000",
      title: "Tesouro Selic 2027",
      date: "2022-01-01T21:00:00",
      totalBorrowed: "1000",
    },
    {
      institution: "Banco PQR",
      amount: "30000",
      title: "Tesouro Selic 2028",
      date: "2022-01-01T20:30:00",
      totalBorrowed: "1000",
    },
    {
      institution: "Banco STU",
      amount: "10000",
      title: "Tesouro Selic 2029",
      date: "2022-01-01T20:00:00",
      totalBorrowed: "1000",
    },
    {
      institution: "Banco VWX",
      amount: "20000",
      title: "Tesouro Selic 2027",
      date: "2022-01-01T19:30:00",
      totalBorrowed: "1000",
    },
    {
      institution: "Banco YZA",
      amount: "30000",
      title: "Tesouro Selic 2028",
      date: "2022-01-01T19:00:00",
      totalBorrowed: "1000",
    },
  ];

  const formatCurrency = (value: string) => {
    return `R$ ${parseFloat(value).toFixed(2).replace(".", ",")}`;
  };

  const handleRowClick = (index: number) => {
    // Toggle the selected row (open/close) on click
    setSelectedRowIndex(selectedRowIndex === index ? null : index);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col flex-grow bg-base-200 items-center py-10">
        <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center w-[95%] rounded-xl">
          <div className="flex flex-row py-4 justify-between w-full px-10">
            <div className="flex flex-col items-start text-left">
              <h1 className="text-2xl mb-0">Menu de operações overnight</h1>
              <p className="text-l my-2 text-zinc-500"></p>
            </div>

            <div className="flex flex-col items-end text-right">
              <button
                onClick={toggleModal}
                className="bg-base-300 hover:bg-base-200 font-medium rounded-md text-sm px-10 py-2.5"
              >
                Solicitar crédito
              </button>

              {isModalOpen && <Modal onClose={toggleModal} />}
            </div>
          </div>

          <div className="flex flex-col py-2 w-full px-10">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Instituição
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantia (MM R$)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Título em colateral
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Data/hora
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loanData.map((data, index) => (
                    <React.Fragment key={index}>
                      <tr
                        className="bg-white border-b hover:bg-base-300 cursor-pointer"
                        onClick={() => handleRowClick(index)}
                      >
                        <td className="px-6 py-4">{data.institution}</td>
                        <td className="px-6 py-4">{formatCurrency(data.amount)}</td>
                        <td className="px-6 py-4">{data.title}</td>
                        <td className="px-6 py-4">{new Date(data.date).toLocaleString()}</td>
                        <td className="px-6 py-4">{`${formatCurrency(data.totalBorrowed)} / ${formatCurrency(
                          data.amount,
                        )}`}</td>
                      </tr>
                      {selectedRowIndex === index && (
                        <>
                          <tr>
                            <td colSpan={5} className="px-6 py-4">
                              <div style={{ height: "250px", width: "100%" }}>{/* Content of the empty field */}</div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="border-t">
                              <hr />
                            </td>
                          </tr>
                        </>
                      )}
                    </React.Fragment>
                  ))}
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
