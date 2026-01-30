import { IsString, IsEmail, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty({ example: 'ahmed_ali' })
  @IsString()
  @MinLength(3)
  username: string;  // ← ADD THIS


  @ApiProperty({ example: 'Ahmed Ali' })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ example: 'ahmed@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '07701234567' })
  @IsString()
  @MinLength(10)
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false, example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false, enum: ['buyer', 'seller', 'both'], example: 'both' })
  @IsOptional()
  @IsEnum(['buyer', 'seller', 'both'])
  userType?: 'buyer' | 'seller' | 'both';

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  province_id?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  city_id?: number;
}