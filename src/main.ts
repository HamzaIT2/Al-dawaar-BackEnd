import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: ['https://aldawaarr.vercel.app'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With','Cache-Control','X-HTTP-Method-Override','X-CSRF-Token', ],
    credentials: true,
  });


  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Iraq Marketplace API')
    .setDescription('API documentation for Iraq peer-to-peer marketplace')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Serve static files from /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);

}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   // Get config service
//   const configService = app.get(ConfigService);

//   // --- 💡 تعديل CORS (هنا الكود الصحيح) 💡 ---
  
//   // قائمة بالمواقع المسموح لها بالاتصال
//   const allowedOrigins = [
//     'http://localhost:5173', // الفرونت اند المحلي
//     // 👇👇 أضف رابط Vercel الخاص بك هنا 👇👇
//     'https://al-dawaar-backend.onrender.com.vercel.app', 
//   ];

//   app.enableCors({
//     origin: (origin, callback) => {
//       // السماح بالطلبات (مثل Postman) التي ليس لها origin
//       // أو الطلبات الموجودة في القائمة المسموحة
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'), false);
//       }
//     },
//     credentials: true,
//   });
//   // --- نهاية تعديل CORS ---

//   // Global validation pipe
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   // API prefix
//   app.setGlobalPrefix('api/v1');

//   // Swagger Configuration
//   const config = new DocumentBuilder()
//     .setTitle('Iraq Marketplace API')
//     .setDescription('API documentation for Iraq peer-to-peer marketplace')
//     .setVersion('1.0')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'JWT',
//         description: 'Enter JWT token',
//         in: 'header',
//       },
//       'JWT-auth',
//     )
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api/docs', app, document);

//   // Serve static files from /uploads
//   app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

//   const port = configService.get<number>('PORT') || 3001;
  
//   // --- 💡 تعديل Listen (مهم لـ Render) 💡 ---
//   // يجب إضافة '0.0.0.0' ليعمل على Render
//   await app.listen(port, '0.0.0.0');

//   // تحديث رسائل الـ Log لتعكس البورت الصحيح
//   console.log(`🚀 Application is running on port: ${port}`);
//   console.log(`📚 Swagger documentation available at /api/docs`);
// }
// bootstrap();