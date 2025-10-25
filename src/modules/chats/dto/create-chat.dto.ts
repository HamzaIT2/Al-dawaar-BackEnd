import { IsInt } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  sellerId: number;

  @IsInt()
  productId: number;
}
