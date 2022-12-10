import {Injectable} from '@nestjs/common';
import {UsersEntity} from "../common/entities/users.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,
    ) {}


    createUser = async (firstName: string, lastName: string, zoomUserId: string): Promise<UsersEntity> => {
        const user = this.usersRepository.create({firstName, lastName, zoomUserId});
        const results = this.usersRepository.save(user)
        return results;
    }

    getUserById = async (id: number): Promise<UsersEntity> => {
        return this.usersRepository.findOne({where: {id: id}});
    }

    getUserByZoomId = async (zoomUserId: string): Promise<UsersEntity> => {
        return await this.usersRepository.findOne({where: {zoomUserId}});
    }
}
