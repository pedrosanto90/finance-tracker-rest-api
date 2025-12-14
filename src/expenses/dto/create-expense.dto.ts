import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { ExpenseCategory } from '../enums/expense-category.enum';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;
}
