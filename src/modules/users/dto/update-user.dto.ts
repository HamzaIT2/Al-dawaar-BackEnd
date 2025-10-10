import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'Ahmed Ali Updated' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false, example: 'أحمد علي' })
  @IsOptional()
  @IsString()
  fullNameAr?: string;

  @ApiProperty({ required: false, example: '07701234567' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  provinceId?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  cityId?: number;

  @ApiProperty({ required: false, example: 'Kadhimiya, near the mosque' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profileImage?: string;
}