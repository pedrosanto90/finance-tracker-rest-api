
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ExpensesService } from '../expenses/expenses.service';

@Injectable()
export class ExpenseOwnerGuard implements CanActivate {
  constructor(private readonly expensesService: ExpensesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const expenseId = parseInt(request.params.id, 10);
    const userId = request.user.userId;

    if (isNaN(expenseId)) {
      throw new NotFoundException('Expense not found.');
    }

    const expense = await this.expensesService.findOne(expenseId);

    if (!expense) {
      throw new NotFoundException('Expense not found.');
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException("You don't have permission to access this resource.");
    }

    return true;
  }
}
