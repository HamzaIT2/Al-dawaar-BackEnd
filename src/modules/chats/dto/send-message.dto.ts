import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsIn(['text'])
  type: 'text';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  text?: string;
}
