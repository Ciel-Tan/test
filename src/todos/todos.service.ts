import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { QueryParamsDto } from "./dto/query-params.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { CategoriesService } from "../categories/categories.service";
import { UsersService } from "../users/users.service";
import { TodoNotFoundException } from "./exceptions/todo-not-found.exception";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entities/todo.entity";
import { Repository } from "typeorm";

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private readonly todosRepository: Repository<Todo>,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService,
    ) {}

    async findAll(queryParams: QueryParamsDto): Promise<Todo[]> {
        let todos = await this.todosRepository.find();
       
        if (queryParams.priority) {
            todos = todos.filter(todo => todo.priority === queryParams.priority);
        }

        const page = queryParams.page || 1;
        const limit = queryParams.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return todos.slice(startIndex, endIndex);
    }

    async findOne(id: number): Promise<Todo> {
        const todo = await this.todosRepository.findOne({ where: { id } });

        if (!todo) {
            throw new TodoNotFoundException(id);
        }

        return todo;
    }

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
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

        const todo = this.todosRepository.save(createTodoDto);
        return todo;
    }

    async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
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