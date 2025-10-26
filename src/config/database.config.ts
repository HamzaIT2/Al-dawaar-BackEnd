import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST','dpg-d3v7j6re5dus73a6i67g-a.frankfurt-postgres.render.com'),
  port: configService.get<number>('DB_PORT',5432),
  username: configService.get<string>('DB_USERNAME','postgre'),
  password: configService.get<string>('DB_PASSWORD','9RaUdujath6QWcWwvs9KiwdLd7V7HuGP'),
  database: configService.get<string>('DB_DATABASE','iraqmarketplace'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV','NODE_ENV') === 'production',
  logging: configService.get<string>('NODE_ENV','NODE_ENV') === 'production',
  ssl:{ rejectUnauthorized: false },
  extra: {
    max: 10,
  },
});
//development