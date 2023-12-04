import { Document } from 'mongoose';

export interface IBank extends Document {
  _id: string;
  name: string;
  address: string;
}
