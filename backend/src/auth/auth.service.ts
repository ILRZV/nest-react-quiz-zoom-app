import {Injectable} from '@nestjs/common';
import zoomApi from "../common/helpers/zoom-api";
import {UsersEntity} from "../common/entities/users.entity";
import {UsersService} from "../user/users.service";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) {}
    async getUserInfo({zoomAuthorizationCode, href, state, zoomInClientState, codeVerifier}): Promise<UsersEntity> {
        if (!zoomAuthorizationCode || state !== zoomInClientState) {
            throw new Error('State mismatch')
        }

        const tokenResponse = await zoomApi.getZoomAccessToken(
            zoomAuthorizationCode,
            href,
            codeVerifier
        )

        const zoomAccessToken = tokenResponse.data.access_token

        const userResponse = await zoomApi.getZoomUser(zoomAccessToken)

        const zoomUserId = userResponse.data.id;

        let user = await this.usersService.getUserByZoomId(zoomUserId)
        if (!user) {
            user = await this.usersService.createUser(userResponse.data.first_name, userResponse.data.last_name, zoomUserId)
        }

        return user;
    }
}
