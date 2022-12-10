import { Module } from '@nestjs/common';
import {QuizAnswersService} from "./quizAnswers.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {QuizAnswersEntity} from "../common/entities/quizAnswers.entity";

@Module({
    imports: [TypeOrmModule.forFeature([QuizAnswersEntity]),],
    providers: [QuizAnswersService],
    exports: [QuizAnswersService]
})
export class QuizAnswersModule {}
