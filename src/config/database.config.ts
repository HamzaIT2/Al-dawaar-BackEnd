import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST','localhost'),
  port: configService.get<number>('DB_PORT',5432),
  username: configService.get<string>('DB_USERNAME','postgres'),
  password: configService.get<string>('DB_PASSWORD','root'),
  database: configService.get<string>('DB_DATABASE','iraq-marketplace'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV','NODE_ENV') === 'development',
  logging: configService.get<string>('NODE_ENV','NODE_ENV') === 'development',
  ssl: { rejectUnauthorized: false },
  extra: {
    max: 10,
  },
});