import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TODOS_CONFIG } from '../types/todos';

@Module({
  controllers: [TodosController],
  providers: [
    TodosService,
    {
      provide: TODOS_CONFIG,
      useValue: {
        maxTodoPerUser: 100,
        maxTitleLength: 200,
        defaultPageSize: process.env.NODE_ENV === 'development' ? 10 : 20
      }
    }
  ],
  imports: [CategoriesModule, UsersModule, TypeOrmModule.forFeature([Todo])],
})
export class TodosModule {}
