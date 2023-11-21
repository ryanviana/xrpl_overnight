import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTpftDto } from './dto/create-tpft.dto';
import { UpdateTpftDto } from './dto/update-tpft.dto';
import { ITPFt } from './tpft.interface';

@Injectable()
export class TpftService {
  constructor(@InjectModel('TPFt') private tpftModel: Model<ITPFt>) {}
  async createTPFt(createTpftDto: CreateTpftDto): Promise<ITPFt> {
    const newTPFt = await new this.tpftModel(createTpftDto);
    return newTPFt.save();
  }
  async udpateTPFt(
    tpftId: string,
    updateTpftDto: UpdateTpftDto,
  ): Promise<ITPFt> {
    const existingTPFt = await this.tpftModel.findByIdAndUpdate(
      tpftId,
      updateTpftDto,
      { new: true },
    );
    if (!existingTPFt) {
      throw new NotFoundException(`TPFt #${tpftId} not found`);
    }
    return existingTPFt;
  }
  async getTPFtByWallet(address: string): Promise<ITPFt[]> {
    const tpfts = await this.tpftModel.find({ address }).exec();
    if (!tpfts || tpfts.length === 0) {
      throw new NotFoundException(
        `No TPFt records found for wallet with address ${address}`,
      );
    }
    return tpfts;
  }
  async getAllTPFts(): Promise<ITPFt[]> {
    const tpftData = await this.tpftModel.find();
    if (!tpftData || tpftData.length == 0) {
      throw new NotFoundException('TPFts data not found');
    }
    return tpftData;
  }
  async getTPFt(tpftId: string): Promise<ITPFt> {
    const existingTPFt = await this.tpftModel.findById(tpftId).exec();
    if (!existingTPFt) {
      throw new NotFoundException(`TPFt #${tpftId} not found`);
    }
    return existingTPFt;
  }
  async deleteTPFt(tpftId: string): Promise<ITPFt> {
    const deletedTPFt = await this.tpftModel.findByIdAndDelete(tpftId);
    if (!deletedTPFt) {
      throw new NotFoundException(`TPFt #${tpftId} not found`);
    }
    return deletedTPFt;
  }
}
