import {QuizzesEntity} from "../entities/quizzes.entity";

export interface IQuiz {
    name: string;
    description: string;
    questions: { id: string, description: string, options: string[] }[];
    userCreator: number;
}

export interface IQuizAnswers {
    answers: undefined | Record<string, string>
}

export type IQuizResponse = QuizzesEntity | IQuizAnswers

export type  IQuizzReport = Record<number, Record<number, number>>