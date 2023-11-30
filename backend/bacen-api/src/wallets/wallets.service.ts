import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IWallet } from './wallet.interface';
import { Model } from 'mongoose';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletService {
  constructor(@InjectModel('Wallet') private walletModel: Model<IWallet>) {}
  async createWallet(createWalletDto: CreateWalletDto): Promise<IWallet> {
    const newWallet = await new this.walletModel(createWalletDto);
    return newWallet.save();
  }
  async updateWallet(
    walletId: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<IWallet> {
    const existingWallet = await this.walletModel.findByIdAndUpdate(
      walletId,
      updateWalletDto,
      { new: true },
    );
    if (!existingWallet) {
      throw new NotFoundException(`Wallet #${walletId} not found`);
    }
    return existingWallet;
  }
  async getAllWallets(): Promise<IWallet[]> {
    const walletData = await this.walletModel.find();
    if (!walletData || walletData.length == 0) {
      throw new NotFoundException('Wallets data not found!');
    }
    return walletData;
  }
  async getWallet(walletId: string): Promise<IWallet> {
    const existingWallet = await this.walletModel.findById(walletId).exec();
    if (!existingWallet) {
      throw new NotFoundException(`Wallet #${walletId} not found`);
    }
    return existingWallet;
  }
  // async deleteWallet(walletId: string): Promise<IWallet> {
  //   const deletedWallet = await this.walletModel.findByIdAndDelete(walletId);
  //   if (!deletedWallet) {
  //     throw new NotFoundException(`Wallet #${walletId} not found`);
  //   }
  //   return deletedWallet;
  // }

  async getWalletsByCpf(cpf: string): Promise<IWallet[]> {
    const wallets = await this.walletModel.find({ cpf: cpf }).exec();
    if (wallets.length === 0) {
      throw new NotFoundException(`Wallets with CPF ${cpf} not found`);
    }
    return wallets;
  }
}
