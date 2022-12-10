import {
    Column,
    Entity, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import {SCHEMA, QUIZZES_TABLE_NAME} from "../contants";
import {UsersEntity} from "./users.entity";
import {QuizAnswersEntity} from "./quizAnswers.entity";


@Entity(QUIZZES_TABLE_NAME, { schema: SCHEMA })
export class QuizzesEntity {
    @Transform(({value}) => +value)
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column('character varying', { name: 'name', length: 50 })
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    questions: string;

    @ManyToOne(() => UsersEntity, (user) => user.quizzes, {
        eager: true,
    })
    userCreator: UsersEntity;

    @OneToMany(
        () => QuizAnswersEntity,
        (quizzesEntity) => quizzesEntity.quizId,
    )
    quizAnswers?: QuizAnswersEntity[];
}