import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
  ) {}

  async countByProduct(productId: number): Promise<number> {
    return this.favoriteRepo.count({ where: { productId } });
  }

  async isFavorited(userId: number, productId: number): Promise<boolean> {
    const existing = await this.favoriteRepo.findOne({ where: { userId, productId } });
    return !!existing;
  }

  async addFavorite(userId: number, productId: number): Promise<{ created: boolean }>{
    // ignore if exists (unique constraint)
    const exists = await this.favoriteRepo.findOne({ where: { userId, productId } });
    if (exists) return { created: false };
    const fav = this.favoriteRepo.create({ userId, productId });
    await this.favoriteRepo.save(fav);
    return { created: true };
  }

  async removeFavorite(userId: number, productId: number): Promise<{ removed: boolean }>{
    const res = await this.favoriteRepo.delete({ userId, productId });
    return { removed: (res.affected ?? 0) > 0 };
  }

  async getUserFavorites(userId: number) {
    return this.favoriteRepo.find({
      where: { userId },
      relations: ['product', 'product.images', 'product.category', 'product.seller', 'product.province', 'product.city'],
      order: { createdAt: 'DESC' },
    });
  }
}
