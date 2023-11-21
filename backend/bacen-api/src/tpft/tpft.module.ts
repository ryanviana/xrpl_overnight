import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TPFt, TPFtSchema } from 'src/schemas/tpft.schema';
import { TpftController } from './tpft.controller';
import { TpftService } from './tpft.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TPFt.name, schema: TPFtSchema }]),
  ],
  controllers: [TpftController],
  providers: [TpftService],
  exports: [TpftService],
})
export class TPFtModule {}
