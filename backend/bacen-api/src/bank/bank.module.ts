// bank.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { Bank } from 'src/schemas/bank.schema';
import { BankSchema } from 'src/schemas/bank.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }]),
  ],
  providers: [BankService],
  controllers: [BankController],
  exports: [BankService],
})
export class BankModule {}
