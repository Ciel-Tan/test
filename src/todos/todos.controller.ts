import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
    private todosService: TodosService;

    constructor() {
        this.todosService = new TodosService();
    }

    @Get()
    findAll(@Query() queryParams: QueryParamsDto) {
        return this.todosService.findAll(queryParams);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.todosService.findOne(id);
    }

    @Post()
    create(@Body() createTodoDto: CreateTodoDto, @Headers() headers: Record<string, string>) {
        return this.todosService.create(createTodoDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto) {
        return this.todosService.update(id, updateTodoDto);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.todosService.delete(id);
    }
}
