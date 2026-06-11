import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('todos')
export class TodosController {
    @Get()
    findAll(@Query() queryParams: QueryParamsDto) {
        const { page, limit, priority } = queryParams;
        if (priority) {
            return `All todos with priority: ${priority}, limit: ${limit}, page: ${page}`;
        }
        return "All todos"
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return `Todo with ID: ${id}`
    }

    @Post(':id')
    create(@Param('id', ParseIntPipe) id: number, @Body() createTodoDto: CreateTodoDto, @Headers() headers: Record<string, string>) {
        const auth = headers['authorization'];
        const userAgent = headers['user-agent'];
        if (auth) {
            return `Create a todo with ID: ${id} and body: ${JSON.stringify(createTodoDto)} and user-agent: ${userAgent}`;
        }

        return "Unauthorized"
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto) {
        return `Update a todo with ID: ${id} and body: ${JSON.stringify(updateTodoDto)}`
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseIntPipe) id: number) {
        return `Delete a todo with ID: ${id}`
    }
}
