import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { QueryParamsDto } from "./dto/query-params.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodosRepository } from "./todos.repository";
import { CategoriesService } from "../categories/categories.service";
import { UsersService } from "../users/users.service";
import { TodoNotFoundException } from "./exceptions/todo-not-found.exception";

@Injectable()
export class TodosService {
    constructor(
        private readonly todosRepository: TodosRepository,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService,
    ) {}

    findAll(queryParams: QueryParamsDto) {
        let todos = this.todosRepository.findAll();
       
        if (queryParams.priority) {
            todos = todos.filter(todo => todo.priority === queryParams.priority);
        }

        const page = queryParams.page || 1;
        const limit = queryParams.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return todos.slice(startIndex, endIndex);
    }

    findOne(id: number) {
        const todo = this.todosRepository.findOne(id);

        if (!todo) {
            throw new TodoNotFoundException(id);
        }

        return todo;
    }

    create(createTodoDto: CreateTodoDto) {
        const user = this.usersService.findById(createTodoDto.userId);
        if (!user) {
            throw new TodoNotFoundException(createTodoDto.userId);
        }

        if (createTodoDto.categoryId) {
            const category = this.categoriesService.findOne(createTodoDto.categoryId);
            if (!category) {
                throw new NotFoundException(`Category with ID ${createTodoDto.categoryId} not found`);
            }
        }

        const existingTodo = this.todosRepository.findByTitle(createTodoDto.title);
        if (existingTodo) {
            throw new BadRequestException(`Todo with title "${createTodoDto.title}" already exists`);
        }

        const todo = this.todosRepository.create(createTodoDto);
        return todo;
    }

    update(id: number, updateTodoDto: UpdateTodoDto) {
        const updatedTodo = this.todosRepository.update(id, updateTodoDto);

        if (!updatedTodo) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
        }

        return updatedTodo;
    }

    delete(id: number) {
        const success = this.todosRepository.delete(id);

        if (!success) {
            throw new TodoNotFoundException(id);
        }
    }
}