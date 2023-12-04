import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBankDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly name: string;
}
