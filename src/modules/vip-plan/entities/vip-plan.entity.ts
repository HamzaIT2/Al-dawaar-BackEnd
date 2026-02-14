import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VipPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // مثال: "الباقة الذهبية"

  @Column()
  days: number; // عدد الأيام: 7

  @Column('decimal')
  price: number; // السعر: 25000
}