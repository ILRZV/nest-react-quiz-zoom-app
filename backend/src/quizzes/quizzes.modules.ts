import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {QuizzesController} from "./quizzes.controller";
import {QuizzesService} from "./quizzes.service";
import {QuizzesEntity} from "../common/entities/quizzes.entity";
import {UsersModule} from "../user/users.module";
import {QuizAnswersModule} from "../quizAnswers/quizAnswers.module";

@Module({
    imports: [TypeOrmModule.forFeature([QuizzesEntity]),UsersModule, QuizAnswersModule],
    controllers: [QuizzesController],
    providers: [QuizzesService],
    exports: [QuizzesService]
})
export class QuizzesModule {}
