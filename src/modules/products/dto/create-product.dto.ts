import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
 @ApiProperty({ example: 'iPhone 13 Pro' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Used iPhone in excellent condition, 256GB' })
  @IsString()
  description: string;

  @ApiProperty({ example: 850000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  provinceId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  cityId: number;

  @ApiProperty({ required: false, enum: ['new', 'like_new', 'good', 'fair', 'poor'], example: 'like_new' })
  @IsOptional()
  @IsEnum(['new', 'like_new', 'good', 'fair', 'poor'])
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isNegotiable?: boolean;

  @ApiProperty({ required: false, enum: ['active', 'sold', 'inactive'], example: 'active' })
  @IsOptional()
  @IsEnum(['active', 'sold', 'inactive'])
  status?: 'active' | 'sold' | 'inactive';
}