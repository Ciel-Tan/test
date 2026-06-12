import { CreateTodoDto } from "./dto/create-todo.dto";
import { QueryParamsDto } from "./dto/query-params.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodosRepository } from "./todos.repository";

export class TodosService {
    private todosRepository: TodosRepository;

    constructor() {
        this.todosRepository = new TodosRepository();
    }

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
            throw new Error(`Todo with ID ${id} not found`);
        }

        return todo;
    }

    create(createTodoDto: CreateTodoDto) {
        const todo = this.todosRepository.create(createTodoDto);
        return todo;
    }

    update(id: number, updateTodoDto: UpdateTodoDto) {
        const updatedTodo = this.todosRepository.update(id, updateTodoDto);

        if (!updatedTodo) {
            throw new Error(`Todo with ID ${id} not found`);
        }

        return updatedTodo;
    }

    delete(id: number) {
        const success = this.todosRepository.delete(id);

        if (!success) {
            throw new Error(`Todo with ID ${id} not found`);
        }
    }
}