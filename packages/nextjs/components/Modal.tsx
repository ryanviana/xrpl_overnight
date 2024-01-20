// Modal.tsx
import React, { useState } from "react";
import Image from "next/image";

type ModalProps = {
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  // Form state
  const [formData, setFormData] = useState({
    bancoSolicitante: "",
    quantia: "",
    tituloColateral: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form data
    console.log(formData);
    onClose(); // Optionally close the modal on submit
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}>
      <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={e => e.stopPropagation()}>
        <div className="bg-white p-5 rounded-lg" style={{ width: "600px", height: "auto" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="bancoSolicitante" className="block text-sm font-medium text-gray-700">
                Banco solicitante
              </label>
              <input
                type="text"
                name="bancoSolicitante"
                id="bancoSolicitante"
                value={formData.bancoSolicitante}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="quantia" className="block text-sm font-medium text-gray-700">
                Quantia (R$)
              </label>
              <input
                type="number"
                name="quantia"
                id="quantia"
                value={formData.quantia}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="tituloColateral" className="block text-sm font-medium text-gray-700">
                Título em colateral
              </label>
              <input
                type="text"
                name="tituloColateral"
                id="tituloColateral"
                value={formData.tituloColateral}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Confirmar
              </button>
            </div>
          </form>
          <button className="absolute top-2 right-2" onClick={onClose}>
            <Image src="/images/cruz.png" alt="Fechar" width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
