import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import Modal from "~~/components/Modal";
import { loanData } from "~~/components/loanData";
import { LoanData } from "~~/components/types";
import { ethers } from 'ethers';
require('dotenv').config();

// Define the type for the inputValues state
type InputValuesType = {
  [key: string]: string;
};

const HomeScreen: NextPage = () => {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [editFormData, setEditFormData] = useState({
    institution: "",
    amount: "",
  });
  const [formattedQuantia, setFormattedQuantia] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Initialize the loans state with loanData
    setLoans(loanData);

    setFormattedQuantia(formatCurrency(editFormData.amount));

    // Define an async function to fetch and filter data
    const fetchDataAndFilter = async () => {
      // If the page has finished loading and the router is ready
      if (router.isReady) {
        // Retrieve the loan amount from the query and set it to the state
        const queryLoanAmount = router.query.loanAmount as string;
        setLoanAmount(queryLoanAmount);
      }
    };

    fetchDataAndFilter(); // Call the async function to fetch and filter data
  }, [router.isReady, router.query.loanAmount, editFormData.amount]); // Dependency array

  const formatCurrency = (value: string) => {
    if (!value) return "R$ 0,00"; // Default value for empty input
    const numberValue = parseFloat(value);
    return isNaN(numberValue) ? "R$ 0,00" : numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleRowClick = (index: number) => {
    // Toggle the selected row (open/close) on click
    setSelectedRowIndex(selectedRowIndex === index ? null : index);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const addNewLoan = (newLoanData: LoanData) => {
    console.log("Adding new loan:", newLoanData); // Check if this logs correctly
    const newLoan: LoanData = {
      ...newLoanData,
      date: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      currentBorrowed: "R$ 0",
    };
    setLoans([newLoan, ...loans]);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setEditFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    if (index == null) return;

    console.log("Submitting form for index:", index); // Log form submission

    let updatedLoans = [...loans];
    let updatedLoan = { ...updatedLoans[index] };

    console.log("Original loan data:", updatedLoan); // Log original loan data

    let newAmount = parseFloat(editFormData.amount) || 0; // Direct conversion
    console.log("New amount entered:", newAmount); // Log new amount entered

    let currentBorrowed = parseFloat(updatedLoan.currentBorrowed.replace("R$", "").trim()) || 0;
    console.log("Current borrowed before update:", currentBorrowed);

    updatedLoan.currentBorrowed = `R$ ${(currentBorrowed + newAmount).toFixed(2)}`;
    console.log("Updated current borrowed:", updatedLoan.currentBorrowed);

    updatedLoans[index] = updatedLoan;

    setLoans(updatedLoans);
    setVersion(v => v + 1); // Trigger re-render

    setEditFormData({ institution: "", amount: "" }); // Reset form data
    console.log("Updated loans array:", updatedLoans);

    try {
      const privateKey = process.env.PRIVATE_KEY!; // Nunca exponha sua chave privada em código de produção
      const provider = new ethers.providers.JsonRpcProvider("https://rpc-evm-sidechain.xrpl.org");
      const wallet = new ethers.Wallet(privateKey, provider);

      const contractAddress = "0xF6ab2D1f34031B564562c012F5809e3F7F28661B";
      const contractABI = "YOUR_CONTRACT_ABI";

      const contract = new ethers.Contract(contractAddress, contractABI, wallet);

      const selectedBank = banks.find(bank => bank.code === editFormData.institution);
      if (!selectedBank) {
          console.error("Banco não selecionado");
          return;
      }

      const tx = await contract.createLiquidityRequest(
          selectedBank.name,
          ethers.utils.parseUnits(editFormData.amount, "ether"),
          "COLLATERAL_ASSET_ADDRESS" // Substitua pelo endereço correto do ativo colateral
      );

      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");
  } catch (error) {
      console.error("Erro ao enviar a transação:", error);
  }
  };

  const banks = [
    { code: "104", name: "Banco Caixa Econômica Federal" },
    { code: "341", name: "Banco Itaú" },
    { code: "237", name: "Banco Bradesco S.A." },
    { code: "001", name: "Banco do Brasil S.A." },
    { code: "033", name: "Banco SANTANDER" },
    { code: "745", name: "Banco Citibank S.A." },
    { code: "399", name: "HSBC Bank Brasil S.A." },
    { code: "208", name: "Banco BTG Pactual S.A." },
    { code: "422", name: "Banco Safra" },
    { code: "655", name: "Banco Votorantim" },
    { code: "260", name: "Nubank" },
    { code: "336", name: "Banco C6 S.A – C6 Bank" },
    { code: "077", name: "Banco Inter" },
    { code: "212", name: "Banco Original" },
    { code: "290", name: "PagBank" },
    { code: "735", name: "Neon Pagamentos" },
    { code: "197", name: "Stone Pagamentos" },
  ];

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
            </div>
          </div>

          <div className="flex flex-col py-2 w-full px-10">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table key={version} className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Instituição
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantia
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
                  {loans.map((loan, index) => (
                    <React.Fragment key={100 - index}>
                      <tr
                        className="bg-white border-b hover:bg-base-300 cursor-pointer"
                        onClick={() => handleRowClick(index)}
                      >
                        <td className="px-6 py-4">
                          {banks.find(bank => bank.code === loan.institution)?.name || "Banco Desconhecido"}
                        </td>
                        <td className="px-6 py-4">{formatCurrency(loan.amount)}</td>
                        <td className="px-6 py-4">{loan.title}</td>
                        <td className="px-6 py-4">{loan.date}</td>
                        <td className="px-6 py-4">
                          {formatCurrency(loan.currentBorrowed)} / {formatCurrency(loan.amount)}
                        </td>
                      </tr>
                      {selectedRowIndex === index && (
                        <>
                          <tr>
                            <td colSpan={5} className="px-6 py-4">
                              <div style={{ height: "190px", width: "100%" }}>
                                <div style={{ height: "190px", width: "100%" }}>
                                  <form onSubmit={e => handleSubmit(e, index)} className="space-y-2">
                                    <div>
                                      <label className="block text-sm font-medium text-left text-gray-700">
                                        Banco credor
                                      </label>
                                      <select
                                        name="institution"
                                        value={editFormData.institution}
                                        onChange={handleEditInputChange}
                                        className="mt-1 px-4 block w-full text-gray-500 h-8 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      >
                                        <option value="">Selecione seu banco</option>
                                        {banks.map(bank => (
                                          <option key={bank.code} value={bank.code}>
                                            {bank.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm text-left font-medium text-gray-700">
                                        Quantia (R$)
                                      </label>
                                      <input
                                        type="string"
                                        name="amount"
                                        value={editFormData.amount}
                                        onChange={handleEditInputChange}
                                        className="mt-1 px-2 block w-full h-8 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      />
                                      <span className="block mt-1 text-sm text-gray-600">
                                        {formattedQuantia ? `Valor do empréstimo: ${formattedQuantia}` : ""}
                                      </span>
                                    </div>
                                    <div>
                                      <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      >
                                        Confirmar
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
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
      {isModalOpen && <Modal onClose={toggleModal} onAddLoan={addNewLoan} />}
    </>
  );
};

export default HomeScreen;