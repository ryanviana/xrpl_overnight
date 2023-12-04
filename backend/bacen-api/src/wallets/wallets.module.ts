import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from 'src/schemas/wallet.schema';
import { WalletsController } from './wallets.controller';
import { WalletService } from './wallets.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  controllers: [WalletsController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletsModule {}
