import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Category } from "../categories/entities/category.entity";
import { Todo } from "../todos/entities/todo.entity";
import { readFromFile } from "../utils/file";

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const usersRepository = app.get<Repository<User>>(getRepositoryToken(User));
    const categoriesRepository = app.get<Repository<Category>>(getRepositoryToken(Category));
    const todosRepository = app.get<Repository<Todo>>(getRepositoryToken(Todo));

    const users = readFromFile<User[]>('users.json');
    const categories = readFromFile<Category[]>('categories.json');
    const todos = readFromFile<Todo[]>('todos.json');

    await usersRepository.save(users);
    await categoriesRepository.save(categories);
    await todosRepository.save(todos);

    await app.close();
}

seed().catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
});