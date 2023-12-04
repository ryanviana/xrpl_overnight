import { Document } from 'mongoose';

export interface ITPFt extends Document {
  _id: string;
  name: string;
  address: string;
  balance: number;
  value: {
    initial: number;
    final: number;
    current: number;
  };
  assetType: string;
}
