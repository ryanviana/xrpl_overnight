import { PartialType } from '@nestjs/mapped-types';
import { CreateTpftDto } from './create-tpft.dto';

export class UpdateTpftDto extends PartialType(CreateTpftDto) {}
