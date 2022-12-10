import {BadRequestException, Injectable} from '@nestjs/common';
import {UsersEntity} from "../common/entities/users.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {QuizAnswersEntity} from "../common/entities/quizAnswers.entity";
import {QuizzesEntity} from "../common/entities/quizzes.entity";
import {IQuizzReport} from "../common/interfaces/quizz.interface";

@Injectable()
export class QuizAnswersService {
    constructor(
        @InjectRepository(QuizAnswersEntity)
        private quizAnswersRepository: Repository<QuizAnswersEntity>,
    ) {}


    createAnswer = async (quiz: QuizzesEntity, user: UsersEntity, answers: string): Promise<QuizAnswersEntity> => {
        const answersToSave = JSON.stringify(answers);
        const quizAnswer = await this.quizAnswersRepository.findOne({
            where: {
                quizId: quiz,
                userId: user
            }
        })
        let result;
        if (quizAnswer) {
            quizAnswer.answers = answersToSave;
            result = await this.quizAnswersRepository.save(quizAnswer);
        } else {
            result = this.quizAnswersRepository.save({
                quizId: quiz,
                userId: user,
                answers: answersToSave
            })
        }
        return result;
    }

    getAnswerByUserAndQuiz = async (quiz: QuizzesEntity, user: UsersEntity): Promise<any> => {
        const rawAnswers = await this.quizAnswersRepository.findOne({
            where: {
                quizId: quiz,
                userId: user
            }
        })
        return rawAnswers ? JSON.parse(rawAnswers.answers) : null;
    }

    generateReport = (quizzes: any[]): IQuizzReport => {
        const report = [];
        quizzes.forEach((current) => {
            const answers = JSON.parse(current.answers);
            for (let key in answers) {
                if (!report[key]) {
                    report[key] = {}
                }
                if (!report[key][answers[key]]) {
                    report[key][answers[key]] = 1;
                } else {
                    report[key][answers[key]] = ++report[key][answers[key]]
                }
            }
        }, {})
        return report
    }

    getAnswersReport = async (quiz: QuizzesEntity): Promise<IQuizzReport> => {
        const quizAnswers = await this.quizAnswersRepository.find(
            {where: {quizId: quiz}, select: {answers: true},})
        return this.generateReport(quizAnswers)
    }

}
