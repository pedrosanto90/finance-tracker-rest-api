import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  create(createExpenseDto: CreateExpenseDto, userId: number) {
    const expense = this.expensesRepository.create({
      ...createExpenseDto,
      date: new Date(createExpenseDto.date), // Convert date string to Date object
      userId,
    });
    return this.expensesRepository.save(expense);
  }

  findAll(userId: number) {
    return this.expensesRepository.find({ where: { userId } });
  }

  async findOne(id: number) {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.findOne(id);
    this.expensesRepository.merge(expense, updateExpenseDto);
    return this.expensesRepository.save(expense);
  }

  async remove(id: number) {
    const expense = await this.findOne(id);
    return this.expensesRepository.remove(expense);
  }
}
