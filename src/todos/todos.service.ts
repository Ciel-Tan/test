import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { QueryParamsDto } from "./dto/query-params.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { CategoriesService } from "../categories/categories.service";
import { UsersService } from "../users/users.service";
import { TodoNotFoundException } from "./exceptions/todo-not-found.exception";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entities/todo.entity";
import { DataSource, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { TODOS_CONFIG, type TodosConfig } from "../types/todos";

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private readonly todosRepository: Repository<Todo>,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService,
        private readonly dataSource: DataSource,

        @Inject(TODOS_CONFIG) private readonly config: TodosConfig,
    ) {}

    async findAll(queryParams: QueryParamsDto): Promise<Todo[]> {
        const page = queryParams.page || 1;
        const limit = queryParams.limit || this.config.defaultPageSize;
        const startIndex = (page - 1) * limit;

        const where = queryParams.priority ? { priority: queryParams.priority } : {};

        const todos = await this.todosRepository.find({
            where,
            take: limit,
            skip: startIndex,
            relations: { user: true, category: true },
        });

        return todos
    }

    async findOne(id: number): Promise<Todo> {
        const todo = await this.todosRepository.findOne({ where: { id }, relations: { user: true, category: true } });

        if (!todo) {
            throw new TodoNotFoundException(id);
        }

        return todo;
    }

    async create(createTodoDto: CreateTodoDto) {
        const user = await this.usersService.findById(createTodoDto.userId);
        if (!user) {
            throw new TodoNotFoundException(createTodoDto.userId);
        }

        if (createTodoDto.categoryId) {
            const category = await this.categoriesService.findOne(createTodoDto.categoryId);
            if (!category) {
                throw new NotFoundException(`Category with ID ${createTodoDto.categoryId} not found`);
            }
        }

        const existingTodo = await this.todosRepository.findOne({ where: { title: createTodoDto.title } });
        if (existingTodo) {
            throw new BadRequestException(`Todo with title "${createTodoDto.title}" already exists`);
        }

        return this.dataSource.transaction(async (manager) => {
            const savedTodo = await manager.save(Todo, createTodoDto);

            await manager.update(
                User, 
                { id: createTodoDto.userId }, 
                { lastActivityAt: new Date() }
            );

            return savedTodo;
        })
    }

    async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
        if (updateTodoDto.categoryId) {
            const category = await this.categoriesService.findOne(updateTodoDto.categoryId);
            if (!category) {
                throw new NotFoundException(`Category with ID ${updateTodoDto.categoryId} not found`);
            }
        }

        const todo = await this.todosRepository.findOne({ where: { id } });

        if (!todo) {
            throw new TodoNotFoundException(id);
        }

        Object.assign(todo, updateTodoDto);

        return this.todosRepository.save(todo);
    }

    async delete(id: number) {
        const success = await this.todosRepository.delete(id);

        if (!success.affected) {
            throw new TodoNotFoundException(id);
        }
    }
}