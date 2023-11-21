import { Body, Controller, Get, Post } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';

@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.createBank(createBankDto);
  }

  @Get()
  findAll() {
    return this.bankService.getAllBanks();
  }
}
