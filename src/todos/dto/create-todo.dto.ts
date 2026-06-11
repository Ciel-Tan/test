import { IsEnum, IsInt, IsOptional, IsString, MinLength } from "class-validator";
import { TodoPriority } from "../enums/todo-priority.enum";
import { TodoStatus } from "../enums/todo-status.enum";

export class CreateTodoDto {
    @IsString()
    @MinLength(1, { message: 'Title must be at least 1 character long' })
    title!: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsEnum(TodoStatus, { message: `Status must be one of the following: ${Object.values(TodoStatus).join(', ')}` })
    status?: TodoStatus;
    @IsOptional()
    @IsEnum(TodoPriority, { message: `Priority must be one of the following: ${Object.values(TodoPriority).join(', ')}` })
    priority?: TodoPriority;
    @IsOptional()
    @IsInt({ message: 'Category ID must be an integer' })
    categoryId?: number;
}
