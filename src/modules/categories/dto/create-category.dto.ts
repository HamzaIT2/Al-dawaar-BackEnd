import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'الإلكترونيات' })
  @IsOptional()
  @IsString()
  nameAr?: string;

  @ApiProperty({ required: false, example: 'All electronic devices and accessories' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    required: false, 
    example: null,
    description: 'Parent category ID for subcategories. Leave null for main categories.'
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}