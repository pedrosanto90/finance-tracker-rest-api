import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];
}
