import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  chain: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
