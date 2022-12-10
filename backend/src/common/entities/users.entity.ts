import {
    Column,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import {SCHEMA, USERS_TABLE_NAME} from "../contants";
import {QuizzesEntity} from "./quizzes.entity";
import {QuizAnswersEntity} from "./quizAnswers.entity";


@Entity(USERS_TABLE_NAME, { schema: SCHEMA })
export class UsersEntity {
    @Transform(({value}) => +value)
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column('character varying', { name: 'first_name', length: 50 })
    firstName: string;

    @Column('character varying', { name: 'last_name', length: 50 })
    lastName: string;

    @Column('character varying', { name: 'zoom_user_id', length: 50 })
    zoomUserId: string;

    @OneToMany(
        () => QuizzesEntity,
        (quizzesEntity) => quizzesEntity.userCreator,
    )
    quizzes?: QuizzesEntity[];

    @OneToMany(
        () => QuizAnswersEntity,
        (quizzesEntity) => quizzesEntity.userId,
    )
    quizAnswers?: QuizAnswersEntity[];
}