import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBank } from './bank.interface';
import { Model } from 'mongoose';
import { UpdateBankDto } from './dto/update-bank.dto';
import { CreateBankDto } from './dto/create-bank.dto';

@Injectable()
export class BankService {
  constructor(@InjectModel('Bank') private bankModel: Model<IBank>) {}
  async createBank(createBankDto: CreateBankDto): Promise<IBank> {
    const newBank = await new this.bankModel(createBankDto);
    return newBank.save();
  }
  async updateBank(
    bankId: string,
    UpdateBankDto: UpdateBankDto,
  ): Promise<IBank> {
    const existingBank = await this.bankModel.findByIdAndUpdate(
      bankId,
      UpdateBankDto,
      { new: true },
    );
    if (!existingBank) {
      throw new NotFoundException(`Bank #${bankId} not found`);
    }
    return existingBank;
  }
  async getAllBanks(): Promise<IBank[]> {
    const bankData = await this.bankModel.find();
    if (!bankData || bankData.length == 0) {
      throw new NotFoundException('Banks data not found!');
    }
    return bankData;
  }
  async getBank(bankId: string): Promise<IBank> {
    const existingBank = await this.bankModel.findById(bankId).exec();
    if (!existingBank) {
      throw new NotFoundException(`Bank #${bankId} not found`);
    }
    return existingBank;
  }
  // async deleteBank(bankId: string): Promise<IBank> {
  //   const deletedBank = await this.bankModel.findByIdAndDelete(bankId);
  //   if (!deletedBank) {
  //     throw new NotFoundException(`Bank #${bankId} not found`);
  //   }
  //   return deletedBank;
  // }
}
