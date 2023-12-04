interface Wallet {
  _id: string;
  bankName: string;
  address: string;
  cpf: string;
}

interface AssetValue {
  initial: number;
  final: number;
  current: number;
}

interface TPFt {
  _id: string;
  name: string;
  address: string;
  balance: number;
  value: AssetValue;
  assetType: string;
}

export async function fetchWalletByCpfAndBank(cpf: string) {
  // Pointing to the Next.js API route
  const apiUrl = `/api/wallet-proxy?cpf=${cpf}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data: Wallet[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function fetchTPFtByAddress() {
  const apiUrl = `/api/tpft-proxy`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data: TPFt[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function findAddressByBankName(data: Wallet[], bankName: string): Promise<string[]> {
  try {
    const filteredData = data.find(wallet => wallet.bankName === bankName);

    if (!filteredData) {
      throw new Error(`No data found for bank: ${bankName}`);
    }

    return [filteredData.address];
  } catch (error) {
    console.error("Error filtering and extracting data:", error);
    throw error;
  }
}

export async function findTPFtByAddres(data: TPFt[], address: string): Promise<TPFt> {
  try {
    const filteredData = data.find(tpft => tpft.address === address);

    if (!filteredData) {
      throw new Error(`No data found for address: ${address}`);
    }

    return filteredData;
  } catch (error) {
    console.error("Error filtering and extracting data:", error);
    throw error;
  }
}
