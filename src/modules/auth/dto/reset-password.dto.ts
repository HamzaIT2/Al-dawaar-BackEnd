import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون أكثر من 6 أحرف' })
  password: string;
}