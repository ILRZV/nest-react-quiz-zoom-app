import {
    BadRequestException,
    Body,
    Controller,
    Get, HttpException,
    Param,
    ParseIntPipe,
    Post,
    Session
} from '@nestjs/common';
import {QuizzesService} from "./quizzes.service";
import {IQuiz, IQuizResponse, IQuizzReport} from "../common/interfaces/quizz.interface";
import {QuizzesEntity} from "../common/entities/quizzes.entity";
import {ConfigService} from "@nestjs/config";

@Controller('quizzes')
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService,) {}


    @Post()
    async createQuiz(@Session() session: Record<string, any>, @Body() quiz: IQuiz): Promise<QuizzesEntity> {
        try {
            return await this.quizzesService.createQuiz(quiz, +session.userId);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error);
        }
    }

    @Get()
    async getQuizzes(): Promise<QuizzesEntity[]> {
        try {
            return await this.quizzesService.getQuizzes();
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error);
        }
    }

    @Get('/:id')
    async getQuiz(@Session() session: Record<string, any>, @Param('id', ParseIntPipe) id: number): Promise<IQuizResponse> {
        try {
            return await this.quizzesService.getQuizById(id, +session.userId);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error);
        }
    }

    @Post('/:id')
    async answerQuiz(@Session() session: Record<string, any>, @Param('id', ParseIntPipe) id: number,
                     @Body() body: any): Promise<QuizzesEntity> {
        try {
            return await this.quizzesService.answerQuiz(id, session.userId, body);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error);
        }
    }

    @Get('report/:id')
    async getReport(@Param('id', ParseIntPipe) id: number, @Session() session: Record<string, any>): Promise<IQuizzReport> {
        try {
            return await this.quizzesService.getAnswersReport(id, session.userId);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error);
        }
    }
}