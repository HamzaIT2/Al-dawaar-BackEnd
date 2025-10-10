import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const product = this.productRepository.create({
      ...createProductDto,
      sellerId: user.userId,
    });

    return await this.productRepository.save(product);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const [products, total] = await this.productRepository.findAndCount({
      where: { status: 'active' },
      relations: ['seller', 'category', 'province', 'city', 'images'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { productId: id },
      relations: ['seller', 'category', 'province', 'city', 'images'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByUser(userId: number, page: number = 1, limit: number = 20) {
    const [products, total] = await this.productRepository.findAndCount({
      where: { sellerId: userId },
      relations: ['category', 'province', 'city', 'images'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.findOne(id);

    if (product.sellerId !== user.userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number, user: User) {
    const product = await this.findOne(id);

    if (product.sellerId !== user.userId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async searchProducts(query: string, page: number = 1, limit: number = 20) {
    const [products, total] = await this.productRepository
      .createQueryBuilder('product')
      .where('product.status = :status', { status: 'active' })
      .andWhere(
        '(product.title ILIKE :query OR product.description ILIKE :query)',
        { query: `%${query}%` },
      )
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.province', 'province')
      .leftJoinAndSelect('product.city', 'city')
      .leftJoinAndSelect('product.images', 'images')
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async filterProducts(
    categoryId?: number,
    provinceId?: number,
    cityId?: number,
    minPrice?: number,
    maxPrice?: number,
    condition?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.status = :status', { status: 'active' });

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (provinceId) {
      query.andWhere('product.provinceId = :provinceId', { provinceId });
    }

    if (cityId) {
      query.andWhere('product.cityId = :cityId', { cityId });
    }

    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (condition) {
      query.andWhere('product.condition = :condition', { condition });
    }

    const [products, total] = await query
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.province', 'province')
      .leftJoinAndSelect('product.city', 'city')
      .leftJoinAndSelect('product.images', 'images')
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}