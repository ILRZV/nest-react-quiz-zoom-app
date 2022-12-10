import { Module } from '@nestjs/common';
import {UsersService} from "./users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersEntity} from "../common/entities/users.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity]),],
    controllers: [],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
