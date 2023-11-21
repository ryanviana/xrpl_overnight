import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTpftDto } from './dto/create-tpft.dto';
import { UpdateTpftDto } from './dto/update-tpft.dto';
import { TpftService } from './tpft.service';

@Controller('TPFts')
export class TpftController {
  constructor(private readonly tpftService: TpftService) {}

  @Post()
  create(@Body() createTpftDto: CreateTpftDto) {
    return this.tpftService.createTPFt(createTpftDto);
  }

  @Get()
  findAll() {
    return this.tpftService.getAllTPFts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tpftService.getTPFt(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTpftDto: UpdateTpftDto) {
    return this.tpftService.udpateTPFt(id, updateTpftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tpftService.deleteTPFt(id);
  }

  @Get('/wallet/:walletId')
  findByWallet(@Param('walletId') walletId: string) {
    return this.tpftService.getTPFtByWallet(walletId);
  }
}
