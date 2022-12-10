import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {QuizzesEntity} from "../common/entities/quizzes.entity";
import {IQuiz, IQuizResponse, IQuizzReport} from "../common/interfaces/quizz.interface";
import {UsersService} from "../user/users.service";
import {QuizAnswersService} from "../quizAnswers/quizAnswers.service";
import { Subject } from 'rxjs';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectRepository(QuizzesEntity)
        private quizzesRepository: Repository<QuizzesEntity>,
        private readonly userService: UsersService,
        private readonly quizAnswersService: QuizAnswersService
    ) {
    }

    private readonly message$$ = new Subject<any>();
    readonly message$ = this.message$$.asObservable();

    createQuiz = async (quiz: IQuiz, userId: number): Promise<QuizzesEntity> => {
        const user = await this.userService.getUserById(userId)
        console.log(`created`)
        if (!user) throw new BadRequestException('Provided user does not exist');
        const newQuiz = this.quizzesRepository.create({
            ...quiz,
            userCreator: user,
            questions: JSON.stringify(quiz.questions)
        });
        const savedQuiz = await this.quizzesRepository.save(newQuiz)
        this.message$$.next(savedQuiz);
        return savedQuiz;
    }

    getQuizzes = async (): Promise<QuizzesEntity[]> => {
        return this.quizzesRepository.find({ order: {id: 'DESC'}});
    }

    getQuizById = async (id: number, userId: number): Promise<IQuizResponse> => {
        const quiz = await this.findQuizById(id);
        const user = await this.userService.getUserById(userId)
        const answers = await this.quizAnswersService.getAnswerByUserAndQuiz(quiz, user)
        quiz.questions = JSON.parse(quiz.questions);
        return {
            ...quiz,
            answers: answers
        };
    }

    answerQuiz = async (quizId: number, userId: string, answers: any): Promise<any> => {
        const quiz = await this.quizzesRepository.findOne({where: {id: quizId}})
        const user = await this.userService.getUserById(+userId);
        return this.quizAnswersService.createAnswer(quiz, user, answers);
    }

    getAnswersReport = async (quizId: number, userId): Promise<IQuizzReport> => {
        const quiz = await this.quizzesRepository.findOne({where: {id: quizId}})
        if (quiz.userCreator.id !== userId) {
            return null
        }
        return await this.quizAnswersService.getAnswersReport(quiz);
    }

    findQuizById = (id: number): Promise<QuizzesEntity> => {
        return this.quizzesRepository.findOne(
            {
                where: {id: id},
            }
        )
    }
}
