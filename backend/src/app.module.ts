import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./user/users.module";
import {QuizzesModule} from "./quizzes/quizzes.modules";
import {AuthModule} from "./auth/auth.module";
import {configService} from "./config/config";
import {EventsModule} from "./events/events.module";

@Module({
  imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        UsersModule,
        QuizzesModule,
        AuthModule,
        EventsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
