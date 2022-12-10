import {
    Column,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn, Index
} from 'typeorm';
import { Transform } from 'class-transformer';
import {SCHEMA, QUIZ_ANSWERS_TABLE_NAME} from "../contants";
import {UsersEntity} from "./users.entity";
import {QuizzesEntity} from "./quizzes.entity";


@Entity(QUIZ_ANSWERS_TABLE_NAME, { schema: SCHEMA })
@Index(['userId', 'quizId'], { unique: true })
export class QuizAnswersEntity {
    @Transform(({value}) => +value)
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @ManyToOne(() => UsersEntity, (user) => user.quizAnswers, {
        eager: true,
    })
    userId: UsersEntity;

    @ManyToOne(() => QuizzesEntity, (quiz) => quiz.quizAnswers, {
        eager: true,
    })
    quizId: QuizzesEntity;

    @Column('text')
    answers: string;
}