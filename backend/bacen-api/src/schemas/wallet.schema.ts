import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  cpf: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
