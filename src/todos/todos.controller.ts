import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { TodosService } from './todos.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TodoOwnershipGuard } from './guards/todo-ownership.guard';
import { TimingInterceptor } from '../common/interceptors/timing.interceptor';
import { GROUP_USER_BASIC, GROUP_USER_DETAIL } from '../users/entities/user.entity';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Get()
    @UseInterceptors(TimingInterceptor)
    @SerializeOptions({ groups: [GROUP_USER_BASIC] })
    findAll(@Query() queryParams: QueryParamsDto) {
        return this.todosService.findAll(queryParams);
    }

    @Get(':id')
    @SerializeOptions({ groups: [GROUP_USER_DETAIL] })
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
    @UseGuards(AuthGuard, TodoOwnershipGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.todosService.delete(id);
    }
}
