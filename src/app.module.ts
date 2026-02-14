import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';

// Import all feature modules
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ChatsModule } from './modules/chats/chats.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ImagesModule } from './modules/images/images.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import {VipPlan} from './modules/vip-plan/entities/vip-plan.entity';
import { Product } from './modules/products/entities/product.entity';
import { ProductsService } from './modules/products/products.service';
import { ProductsController } from './modules/products/products.controller';
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
      //envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
      
    }),

    MailerModule.forRoot({
      transport:{
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
          user:'hamza.hitham.it22@stu.uoninevah.edu.iq',
          pass:'iihf ctbo zkim niiz'
        },
      },
      defaults:{
        from:'"No Reply" <hamza.hitham.it22@stu.uoninevah.edu.iq>'
      },
      
    }),

    // Feature Modules
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ProvincesModule,
    ConversationsModule,
    MessagesModule,
    TransactionsModule,
    ChatsModule,
    ReviewsModule,
    FavoritesModule,
    ImagesModule,
    AuthModule,
    TypeOrmModule.forFeature([Product,VipPlan]),
  ],

})
export class AppModule {}