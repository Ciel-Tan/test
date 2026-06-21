import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Todo } from "../../todos/entities/todo.entity";
import { Exclude, Expose } from "class-transformer";

export const GROUP_USER_BASIC = 'group_user_basic';
export const GROUP_USER_DETAIL = 'group_user_detail';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Expose({ groups: [GROUP_USER_BASIC, GROUP_USER_DETAIL] })
    id!: number;
    
    @Column()
    @Expose({ groups: [GROUP_USER_BASIC, GROUP_USER_DETAIL] })
    name!: string;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos!: Todo[];

    @Column({ type: 'timestamp', nullable: true })
    @Expose()
    lastActivityAt!: Date;

    @Column({ nullable: true })
    @Expose({ groups: [GROUP_USER_DETAIL] })
    email?: string;
}