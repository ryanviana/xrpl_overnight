import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly bankName: string;

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @MaxLength(11)
  @IsNotEmpty()
  readonly cpf: string;
}
