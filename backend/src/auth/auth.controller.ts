import {
    BadGatewayException,
    BadRequestException,
    Body,
    Controller,
    Get, HttpException,
    Post,
    Redirect,
    Req,
    Request,
    Session
} from '@nestjs/common';
import {AuthService} from './auth.service';
import zoomHelpers from "../common/helpers/zoom-helpers";
import {IAuthorizeResponse, IOnAuth} from "../common/interfaces/auth.interface";
import {UsersEntity} from "../common/entities/users.entity";

@Controller('api/zoomapp')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Get('authorize')
    async inClientAuthorize(@Session() session: Record<string, any>): Promise<IAuthorizeResponse> {
        try {
            const codeVerifier = zoomHelpers.generateCodeVerifier()
            const zoomInClientState = zoomHelpers.generateState()
            session.codeVerifier = codeVerifier
            session.state = zoomInClientState

            return {
                codeChallenge: codeVerifier,
                state: zoomInClientState,
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error);
        }
    }

    @Post('onauthorized')
    async inClientOnAuthorized(@Session() session: Record<string, any>, @Body() body: IOnAuth): Promise<UsersEntity> {
        try {
            const user = await this.authService.getUserInfo({
                zoomAuthorizationCode: body.code,
                href: body.href,
                state: decodeURIComponent(body.state),
                codeVerifier: session.codeVerifier,
                zoomInClientState: session.state,
            });
            session.userId = user.id;

            return user;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error);
        }
    }
}