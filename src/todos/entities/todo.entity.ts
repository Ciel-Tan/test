import { TodoPriority } from "../enums/todo-priority.enum";
import { TodoStatus } from "../enums/todo-status.enum";

export class Todo {
    id!: number;
    title!: string;
    description!: string;
    status!: TodoStatus;
    priority!: TodoPriority;
    userId!: number;
    categoryId?: number;
    createdAt!: Date;
    updatedAt!: Date;
}