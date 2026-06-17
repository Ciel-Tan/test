import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TodoPriority } from "../enums/todo-priority.enum";
import { TodoStatus } from "../enums/todo-status.enum";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.OPEN })
    status!: TodoStatus;

    @Column({ type: 'enum', enum: TodoPriority, default: TodoPriority.MEDIUM })
    priority!: TodoPriority;

    @Column()
    userId!: number;

    @Column({ nullable: true })
    categoryId?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}