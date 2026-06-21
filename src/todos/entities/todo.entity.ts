import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TodoPriority } from "../enums/todo-priority.enum";
import { TodoStatus } from "../enums/todo-status.enum";
import { User } from "../../users/entities/user.entity";
import { Category } from "../../categories/entities/category.entity";

@Index(['userId'])
@Index(['categoryId'])
@Index(['userId', 'title'])
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

    @Column({ type: 'enum', enum: TodoPriority, nullable: true })
    priority!: TodoPriority;

    @Column()
    userId!: number;

    @ManyToOne(() => User, user => user.todos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ nullable: true })
    categoryId?: number;

    @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category?: Category;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}