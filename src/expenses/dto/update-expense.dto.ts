import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';
import { ExpenseCategory } from '../enums/expense-category.enum';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
