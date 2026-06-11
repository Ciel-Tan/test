import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { TodoPriority } from "../enums/todo-priority.enum";

export class QueryParamsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;
    @IsOptional()
    @IsInt()
    @Max(100)
    limit?: number = 10;
    @IsOptional()
    @IsEnum(TodoPriority, { message: `Priority must be one of the following: ${Object.values(TodoPriority).join(', ')}` })
    priority?: TodoPriority = TodoPriority.MEDIUM;
}
