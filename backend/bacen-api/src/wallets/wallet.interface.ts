import { Document } from 'mongoose';

export interface IWallet extends Document {
  _id: string;
  address: string;
  bankName: string;
  cpf: string;
}
