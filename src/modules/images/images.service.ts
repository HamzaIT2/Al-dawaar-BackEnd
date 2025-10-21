import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async uploadForProduct(productId: number, files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    const product = await this.productRepository.findOne({ where: { productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Determine starting order based on existing images
    const existingCount = await this.imageRepository.count({ where: { productId } });

    const entities = files.map((file, index) => {
      const img = this.imageRepository.create({
        product,
        productId: product.productId,
        url: `/uploads/${file.filename}`,
        imageUrl: `/uploads/${file.filename}`,
        isPrimary: existingCount === 0 && index === 0,
        displayOrder: existingCount + index,
      });
      return img;
    });

    const saved = await this.imageRepository.save(entities);
    return saved;
  }
}
