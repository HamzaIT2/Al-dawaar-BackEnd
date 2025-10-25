import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, PrismaClient],
  exports: [ChatsService],
})
export class ChatsModule {}
