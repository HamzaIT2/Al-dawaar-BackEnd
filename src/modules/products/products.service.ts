
// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from './entities/product.entity';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { User } from '../users/entities/user.entity';


// import { Image } from '../images/entities/image.entity';

// @Injectable()
// export class ProductsService {
//   findAll(page: number, limit: number) {
//     throw new Error('Method not implemented.');
//   }
//   searchProducts(query: string, page: number, limit: number) {
//     throw new Error('Method not implemented.');
//   }
//   filterProducts(categoryId: number, provinceId: number, cityId: number, minPrice: number, maxPrice: number, condition: string, page: number, limit: number) {
//     throw new Error('Method not implemented.');
//   }
//   findByUser(userId: number, page: number, limit: number) {
//     throw new Error('Method not implemented.');
//   }
//   update(id: number, updateProductDto: UpdateProductDto, user: User) {
//     throw new Error('Method not implemented.');
//   }
//   remove(id: number, user: User) {
//     throw new Error('Method not implemented.');
//   }
//   constructor(
//     @InjectRepository(Product)
//     private productRepository: Repository<Product>,

    
//     @InjectRepository(Image)
//     private imageRepository: Repository<Image>,
//   ) {}


  
//   async create(
//     createProductDto: CreateProductDto,
//     user: User,
//     images: Array<Express.Multer.File>, 
//   ): Promise<Product> {

    
//     const product = this.productRepository.create({
//       ...createProductDto,
//       seller: user,
//     });
//     const newProduct = await this.productRepository.save(product);

   
//     if (images && images.length > 0) {
//       const imageEntities = images.map((file, index) => {
        
//         return this.imageRepository.create({
//           url: `/uploads/${file.filename}`,
//           product: newProduct, 
//           isPrimary: index === 0, 
//           displayOrder: index,
//         });
//       });

      
//       await this.imageRepository.save(imageEntities);
//     }
    
    
//     return this.findOne(newProduct.productId);
//   }

  
//   async findOne(id: number) {
//     const product = await this.productRepository.findOne({
//       where: { productId: id },
//       relations: ['seller', 'category', 'province', 'city', 'images'], // تأكد من جلب الصور
//     });
//     if (!product) {
//       throw new NotFoundException(`Product with ID "${id}" not found`);
//     }
//     return product;
//   }
//   // ...
// }







// import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from './entities/product.entity';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { User } from '../users/entities/user.entity';

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectRepository(Product)
//     private productRepository: Repository<Product>,
    
//   ) {}

//   async create(createProductDto: CreateProductDto, user: User, images: Express.Multer.File[]) {
//     const product = this.productRepository.create({
//       ...createProductDto,
//       sellerId: user.userId,
//     });
//     console.log('Service attempting to save:', product);
//     return await this.productRepository.save(product);
//   }

//   async findAll(page: number = 1, limit: number = 20) {
//     const [products, total] = await this.productRepository.findAndCount({
//       where: { status: 'active' },
//       relations: ['seller', 'category', 'province', 'city', 'images'],
//       order: { createdAt: 'DESC' },
//       skip: (page - 1) * limit,
//       take: limit,
//     });

//     return {
//       products,
//       total,
//       page,
//       lastPage: Math.ceil(total / limit),
//     };
//   }

//   async findOne(id: number) {
//     const product = await this.productRepository.findOne({
//       where: { productId: id },
//       relations: ['seller', 'category', 'province', 'city', 'images'],
//     });

//     if (!product) {
//       throw new NotFoundException('Product not found');
//     }

//     return product;
//   }

//   async findByUser(userId: number, page: number = 1, limit: number = 20) {
//     const [products, total] = await this.productRepository.findAndCount({
//       where: { sellerId: userId },
//       relations: ['category', 'province', 'city', 'images'],
//       order: { createdAt: 'DESC' },
//       skip: (page - 1) * limit,
//       take: limit,
//     });

//     return {
//       products,
//       total,
//       page,
//       lastPage: Math.ceil(total / limit),
//     };
//   }

//   async update(id: number, updateProductDto: UpdateProductDto, user: User) {
//     const product = await this.findOne(id);

//     if (product.sellerId !== user.userId) {
//       throw new ForbiddenException('You can only update your own products');
//     }

//     Object.assign(product, updateProductDto);
//     return await this.productRepository.save(product);
//   }

//   async remove(id: number, user: User) {
//     const product = await this.findOne(id);

//     if (product.sellerId !== user.userId) {
//       throw new ForbiddenException('You can only delete your own products');
//     }

//     await this.productRepository.remove(product);
//     return { message: 'Product deleted successfully' };
//   }

//   async searchProducts(query: string, page: number = 1, limit: number = 20) {
//     const [products, total] = await this.productRepository
//       .createQueryBuilder('product')
//       .where('product.status = :status', { status: 'active' })
//       .andWhere(
//         '(product.title ILIKE :query OR product.description ILIKE :query)',
//         { query: `%${query}%` },
//       )
//       .leftJoinAndSelect('product.seller', 'seller')
//       .leftJoinAndSelect('product.category', 'category')
//       .leftJoinAndSelect('product.province', 'province')
//       .leftJoinAndSelect('product.city', 'city')
//       .leftJoinAndSelect('product.images', 'images')
//       .orderBy('product.createdAt', 'DESC')
//       .skip((page - 1) * limit)
//       .take(limit)
//       .getManyAndCount();

//     return {
//       products,
//       total,
//       page,
//       lastPage: Math.ceil(total / limit),
//     };
//   }

//   // src/modules/products/products.service.ts

// // ... (داخل كلاس ProductsService)

// async filterProducts(
//   categoryId?: number,
//   provinceId?: number,
//   cityId?: number,
//   minPrice?: number,
//   maxPrice?: number,
//   condition?: string,
//   page = 1,
//   limit = 20,
// ) {
//   const query = this.productRepository.createQueryBuilder('product');

//   query.leftJoinAndSelect('product.images', 'images');
//   // أضف join أخرى حسب الحاجة (للبائع، الفئة، إلخ.)

//   if (categoryId) {
//     query.andWhere('product.categoryId = :categoryId', { categoryId });
//   }
//   if (provinceId) {
//     query.andWhere('product.provinceId = :provinceId', { provinceId });
//   }
//   if (cityId) {
//     query.andWhere('product.cityId = :cityId', { cityId });
//   }
//   if (minPrice !== undefined) {
//     query.andWhere('product.price >= :minPrice', { minPrice });
//   }
//   if (maxPrice !== undefined) {
//     query.andWhere('product.price <= :maxPrice', { maxPrice });
//   }
//   if (condition) {
//     query.andWhere('product.condition = :condition', { condition });
//   }

//   query
//     .orderBy('product.createdAt', 'DESC')
//     .skip((page - 1) * limit)
//     .take(limit);

//   const [results, total] = await query.getManyAndCount();

//   return {
//     data: results,
//     total,
//     page,
//     limit,
//   };
// }






  // async filterProducts(
  //   categoryId?: number,
  //   provinceId?: number,
  //   cityId?: number,
  //   minPrice?: number,
  //   maxPrice?: number,
  //   condition?: string,
  //   page: number = 1,
  //   limit: number = 20,
    
  // ){
  //   const query = this.productRepository
  //     .createQueryBuilder('product')
  //     .where('product.status = :status', { status: 'active' });

  //   if (categoryId) {
  //     query.andWhere('product.categoryId = :categoryId', { categoryId });
  //   }

  //   if (provinceId) {
  //     query.andWhere('product.provinceId = :provinceId', { provinceId });
  //   }

  //   if (cityId) {
  //     query.andWhere('product.cityId = :cityId', { cityId });
  //   }

  //   if (minPrice !== undefined) {
  //     query.andWhere('product.price >= :minPrice', { minPrice });
  //   }

  //   if (maxPrice !== undefined) {
  //     query.andWhere('product.price <= :maxPrice', { maxPrice });
  //   }

  //   if (condition) {
  //     query.andWhere('product.condition = :condition', { condition });
  //   }
    

//     const [products, total] = await query
//       .leftJoinAndSelect('product.seller', 'seller')
//       .leftJoinAndSelect('product.category', 'category')
//       .leftJoinAndSelect('product.province', 'province')
//       .leftJoinAndSelect('product.city', 'city')
//       .leftJoinAndSelect('product.images', 'images')
//       .orderBy('product.createdAt', 'DESC')
//       .skip((page - 1) * limit)
//       .take(limit)
//       .getManyAndCount();

//     return {
//       products,
//       total,
//       page,
//       lastPage: Math.ceil(total / limit),
//     };
//   }
// }




import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Image } from '../images/entities/image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  [x: string]: any;
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    // 1. تأكد من حقن مستودع الصور
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  // 2. دالة إنشاء المنتج مع حفظ الصور
  async create(
    createProductDto: CreateProductDto,
    user: User,
    images: Array<Express.Multer.File>,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      seller: user, // الربط مع كيان المستخدم مباشرة
    });
    const newProduct = await this.productRepository.save(product);

    if (images && images.length > 0) {
      const imageEntities = images.map((file, index) => {
        return this.imageRepository.create({
          url: `/uploads/${file.filename}`,
          product: newProduct,
          isPrimary: index === 0,
          displayOrder: index,
        });
      });
      await this.imageRepository.save(imageEntities);
    }

    return this.findOne(newProduct.productId);
  }

  // 3. دالة جلب كل المنتجات مع تقسيم الصفحات
  async findAll(page: number = 1, limit: number = 20) {
    const [products, total] = await this.productRepository.findAndCount({
      relations: ['seller', 'category', 'province', 'city', 'images'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // 4. دالة فلترة المنتجات (النسخة الصحيحة والكاملة)
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
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.province', 'province')
      .leftJoinAndSelect('product.city', 'city')
      .leftJoinAndSelect('product.images', 'images');

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
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
  
  // -- باقي الدوال تبقى كما هي --

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
        where: { seller: { userId: userId } }, // البحث باستخدام علاقة البائع
        relations: ['category', 'province', 'city', 'images'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
    });
    return {
        data: products,
        total,
        page,
        lastPage: Math.ceil(total / limit),
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.findOne(id);
    if (product.seller.userId !== user.userId) { // التحقق باستخدام علاقة البائع
        throw new ForbiddenException('You can only update your own products');
    }
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number, user: User) {
    const product = await this.findOne(id);
    if (product.seller.userId !== user.userId) { // التحقق باستخدام علاقة البائع
        throw new ForbiddenException('You can only delete your own products');
    }
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}