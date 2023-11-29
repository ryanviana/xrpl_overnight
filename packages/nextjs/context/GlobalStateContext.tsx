import React, { ReactNode, createContext, useContext, useState } from "react";

// Define a type for your context state
interface GlobalStateContextType {
  balance: string;
  setBalance: (balance: string) => void;
}

// Create the context with an initial empty state
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// Custom hook for easier usage of the context
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

// Provider component
interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<string>("R$ 0,00");

  return <GlobalStateContext.Provider value={{ balance, setBalance }}>{children}</GlobalStateContext.Provider>;
};
