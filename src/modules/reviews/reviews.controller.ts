import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List reviews for a user (as reviewed target)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.listForUser(userId, page ?? 1, limit ?? 20);
  }

  @Get('user/:userId/summary')
  @ApiOperation({ summary: 'Get rating summary (average and count) for a user' })
  summary(@Param('userId', ParseIntPipe) userId: number) {
    return this.reviewsService.summaryForUser(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a review for a user in a transaction' })
  create(
    @CurrentUser() user: User,
    @Body()
    body: { transactionId: number; reviewedUserId: number; rating: number; comment?: string },
  ) {
    return this.reviewsService.create({
      transactionId: Number(body.transactionId),
      reviewerId: user.userId,
      reviewedUserId: Number(body.reviewedUserId),
      rating: Number(body.rating),
      comment: body.comment,
    });
  }
}
