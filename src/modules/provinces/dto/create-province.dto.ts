import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProvinceDto {
  @ApiProperty({ example: 'Baghdad' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'بغداد' })
  @IsString()
  nameAr: string;

  @ApiProperty({ required: false, example: 'Capital of Iraq' })
  @IsOptional()
  @IsString()
  description?: string;
}