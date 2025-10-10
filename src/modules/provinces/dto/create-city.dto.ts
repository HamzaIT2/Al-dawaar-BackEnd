import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({ example: 'Kadhimiya' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'الكاظمية' })
  @IsString()
  nameAr: string;

  @ApiProperty({ example: 1, description: 'Province ID this city belongs to' })
  @IsNumber()
  provinceId: number;
}