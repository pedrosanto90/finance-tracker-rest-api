import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { ExpenseCategory } from '../enums/expense-category.enum';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  category: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;
}
