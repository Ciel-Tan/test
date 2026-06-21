import { Todo } from "../todos/entities/todo.entity";

declare module 'express' {
    interface Request {
        userId?: number,
        todo?: Todo
    }
}