import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/users.entity';
import { Expense } from '../src/expenses/entities/expense.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { ExpensesModule } from '../src/expenses/expenses.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { ExpenseCategory } from '../src/expenses/enums/expense-category.enum';

jest.setTimeout(30000);

describe('ExpensesController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;
  let expenseId: number;
  let otherUserToken: string;
  let userRepository: Repository<User>;
  let expenseRepository: Repository<Expense>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [User, Expense],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        ExpensesModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get('UserRepository');
    expenseRepository = moduleFixture.get('ExpenseRepository');

    await userRepository.clear();
    await expenseRepository.clear();

    // Create a user and get a token
    const user = {
      username: 'testuser',
      password: 'testpassword',
      email: 'test@example.com',
    };
    await request(app.getHttpServer()).post('/users').send(user);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: user.username, password: user.password });
    token = loginResponse.body.access_token;
    const userResponse = await request(app.getHttpServer())
      .post('/users/user')
      .query({ username: user.username });
    userId = userResponse.body.id;

    // Create another user
    const otherUser = {
      username: 'otheruser',
      password: 'otherpassword',
      email: 'other@example.com',
    };
    await request(app.getHttpServer()).post('/users').send(otherUser);
    const otherUserLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: otherUser.username, password: otherUser.password });
    otherUserToken = otherUserLoginResponse.body.access_token;
  });

  it('/expenses (POST) - should create an expense for the logged-in user', () => {
    const expense = {
      description: 'Test Expense',
      amount: 100,
      date: new Date().toISOString(),
      category: ExpenseCategory.FOOD,
    };
    return request(app.getHttpServer())
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send(expense)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expenseId = response.body.id;
        expect(response.body.description).toBe(expense.description);
        expect(response.body.amount).toBe(expense.amount);
        expect(response.body.userId).toBe(userId);
        expect(response.body.category).toBe(expense.category);
      });
  });

  it('/expenses (POST) - should return 400 for invalid category', () => {
    const expense = {
      description: 'Test Expense',
      amount: 100,
      date: new Date().toISOString(),
      category: 'INVALID_CATEGORY',
    };
    return request(app.getHttpServer())
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send(expense)
      .expect(400);
  });

  it('/expenses (POST) - should return 401 if no token is provided', () => {
    const expense = {
      description: 'Test Expense',
      amount: 100,
      date: new Date().toISOString(),
      category: ExpenseCategory.FOOD,
    };
    return request(app.getHttpServer()).post('/expenses').send(expense).expect(401);
  });

  it('/expenses (GET) - should return the expenses for the logged-in user', () => {
    return request(app.getHttpServer())
      .get('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe(expenseId);
      });
  });

  it('/expenses (GET) - should return 401 if no token is provided', () => {
    return request(app.getHttpServer()).get('/expenses').expect(401);
  });

  it('/expenses/:id (GET) - should return the expense if the user is the owner', () => {
    return request(app.getHttpServer())
      .get(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(expenseId);
      });
  });

  it('/expenses/:id (GET) - should return 403 if the user is not the owner', () => {
    return request(app.getHttpServer())
      .get(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .expect(403);
  });

  it('/expenses/:id (GET) - should return 401 if no token is provided', () => {
    return request(app.getHttpServer()).get(`/expenses/${expenseId}`).expect(401);
  });

  it('/expenses/:id (PATCH) - should update the expense if the user is the owner', () => {
    const updatedExpense = {
      description: 'Updated Expense',
      category: ExpenseCategory.SHOPPING,
    };
    return request(app.getHttpServer())
      .patch(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedExpense)
      .expect(200)
      .then((response) => {
        expect(response.body.description).toBe(updatedExpense.description);
        expect(response.body.category).toBe(updatedExpense.category);
      });
  });

  it('/expenses/:id (PATCH) - should return 403 if the user is not the owner', () => {
    const updatedExpense = {
      description: 'Updated Expense',
    };
    return request(app.getHttpServer())
      .patch(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send(updatedExpense)
      .expect(403);
  });

  it('/expenses/:id (PATCH) - should return 401 if no token is provided', () => {
    const updatedExpense = {
      description: 'Updated Expense',
    };
    return request(app.getHttpServer())
      .patch(`/expenses/${expenseId}`)
      .send(updatedExpense)
      .expect(401);
  });

  it('/expenses/:id (DELETE) - should return 403 if the user is not the owner', () => {
    return request(app.getHttpServer())
      .delete(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .expect(403);
  });

  it('/expenses/:id (DELETE) - should delete the expense if the user is the owner', () => {
    return request(app.getHttpServer())
      .delete(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/expenses/:id (DELETE) - should return 401 if no token is provided', () => {
    return request(app.getHttpServer()).delete(`/expenses/${expenseId}`).expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
