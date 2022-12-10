import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import {QuizzesModule} from "../quizzes/quizzes.modules";

@Module({
    imports: [QuizzesModule],
    controllers: [],
    providers: [EventsGateway],
})

export class EventsModule {}