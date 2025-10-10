import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Province } from './province.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn({ name: 'city_id' })
  cityId: number;

  @Column({ name: 'province_id' })
  provinceId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'name_ar', length: 100 })
  nameAr: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Province, (province) => province.cities)
  @JoinColumn({ name: 'province_id' })
  province: Province;
}