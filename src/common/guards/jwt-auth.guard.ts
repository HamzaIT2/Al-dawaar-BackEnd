import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. التحقق هل الرابط يحمل علامة @Public؟
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. إذا كان Public، اسمح بالمرور فوراً (Return true)
    if (isPublic) {
      return true;
    }

    // 3. إذا لم يكن Public، طبق منطق الحماية العادي (افحص التوكن)
    return super.canActivate(context);
  }
}