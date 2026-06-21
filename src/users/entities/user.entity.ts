import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Todo } from "../../todos/entities/todo.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    name!: string;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos!: Todo[];

    @Column({ type: 'timestamp', nullable: true })
    lastActivityAt!: Date;

    @Column({ nullable: true })
    email?: string;
}