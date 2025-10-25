import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async listForUser(userId: number, page = 1, limit = 20) {
    const [items, total] = await this.reviewRepo.findAndCount({
      where: { reviewedUserId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['reviewer'],
    });
    return { items, total, page, lastPage: Math.ceil(total / limit) };
  }

  async summaryForUser(userId: number) {
    const row = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.reviewId)', 'count')
      .where('r.reviewedUserId = :uid', { uid: userId })
      .getRawOne<{ avg: string; count: string }>();
    const count = Number(row?.count || 0);
    const avg = count > 0 ? Number(parseFloat(row!.avg).toFixed(2)) : 0;
    return { userId, ratingAverage: avg, ratingCount: count };
  }

  async create(review: { transactionId: number; reviewedUserId: number; reviewerId: number; rating: number; comment?: string }) {
    // Basic input validation
    if (!Number.isInteger(review.transactionId) || review.transactionId <= 0) {
      throw new BadRequestException('transactionId must be a positive integer');
    }
    if (!Number.isInteger(review.reviewedUserId) || review.reviewedUserId <= 0) {
      throw new BadRequestException('reviewedUserId must be a positive integer');
    }
    if (!Number.isInteger(review.reviewerId) || review.reviewerId <= 0) {
      throw new BadRequestException('Invalid reviewer');
    }
    if (!Number.isFinite(review.rating) || review.rating < 1 || review.rating > 5) {
      throw new BadRequestException('rating must be 1..5');
    }
    if (review.reviewerId === review.reviewedUserId) {
      throw new BadRequestException('Cannot review yourself');
    }

    // Ensure reviewed user exists
    const reviewedUser = await this.userRepo.findOne({ where: { userId: review.reviewedUserId } });
    if (!reviewedUser) throw new NotFoundException('Reviewed user not found');

    // Ensure transaction exists and involves both reviewer and reviewed user
    const tx = await this.txRepo.findOne({ where: { transactionId: review.transactionId } });
    if (!tx) throw new NotFoundException('Transaction not found');
    const participants = new Set([tx.buyerId, tx.sellerId]);
    if (!participants.has(review.reviewerId) || !participants.has(review.reviewedUserId)) {
      throw new ForbiddenException('Reviewer and reviewed must be participants in the transaction');
    }

    // Prevent duplicates at application level
    const exists = await this.reviewRepo.findOne({ where: { transactionId: review.transactionId, reviewerId: review.reviewerId } });
    if (exists) {
      throw new BadRequestException('Already reviewed this transaction');
    }

    try {
      const entity = this.reviewRepo.create(review);
      return await this.reviewRepo.save(entity);
    } catch (e: any) {
      // Map common DB errors to 400
      const message = (e?.message || '').toLowerCase();
      if (message.includes('unique') || message.includes('duplicate')) {
        throw new BadRequestException('Already reviewed this transaction');
      }
      if (message.includes('violates foreign key') || message.includes('foreign key constraint')) {
        throw new BadRequestException('Invalid transactionId or reviewedUserId');
      }
      throw e;
    }
  }
}
