import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  async listForUser(currentUserId: number, opts: { counterpartyUserId?: number; status?: string; page?: number; limit?: number } = {}) {
    const page = opts.page && opts.page > 0 ? opts.page : 1;
    const limit = opts.limit && opts.limit > 0 ? Math.min(opts.limit, 100) : 20;

    const qb = this.txRepo
      .createQueryBuilder('t')
      .where('(t.buyerId = :me OR t.sellerId = :me)', { me: currentUserId });

    if (opts.counterpartyUserId) {
      qb.andWhere('(t.buyerId = :cp OR t.sellerId = :cp)', { cp: opts.counterpartyUserId });
    }
    if (opts.status) {
      qb.andWhere('t.status = :status', { status: opts.status });
    }

    const [items, total] = await qb
      .orderBy('t.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total, page, lastPage: Math.ceil(total / limit) };
  }
}
