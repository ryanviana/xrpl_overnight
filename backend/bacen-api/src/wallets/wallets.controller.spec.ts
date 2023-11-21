import { Body, Controller, Get, Post } from '@nestjs/common';
import { WalletService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() CreateWalletDto: CreateWalletDto) {
    return this.walletService.createWallet(CreateWalletDto);
  }

  @Get()
  findAll() {
    return this.walletService.getAllWallets();
  }
}
