import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { City } from './city.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn({ name: 'province_id' })
  provinceId: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ name: 'name_ar', length: 100 })
  nameAr: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => City, (city) => city.province)
  cities: City[];
}