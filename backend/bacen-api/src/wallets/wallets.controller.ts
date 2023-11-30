import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WalletService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWallet(createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletService.getAllWallets();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.getWallet(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.updateWallet(id, updateWalletDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.walletService.deleteWallet(id);
  // }

  @Get('/cpf/:cpf')
  findByCpf(@Param('cpf') cpf: string) {
    return this.walletService.getWalletByCpf(cpf);
  }
}
