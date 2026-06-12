import { TodoPriority } from "../todos/enums/todo-priority.enum";
import { TodoStatus } from "../todos/enums/todo-status.enum";

export class Todo {
    id!: number;
    title!: string;
    description!: string;
    status!: TodoStatus;
    priority!: TodoPriority;
    categoryId?: number;
    createdAt!: Date;
    updatedAt!: Date;
}