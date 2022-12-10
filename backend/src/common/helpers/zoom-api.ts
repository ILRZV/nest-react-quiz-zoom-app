import zoomHelpers from "./zoom-helpers";
import axios from "axios";
import {configService} from "../../config/config";


const getZoomAccessToken = async (
    zoomAuthorizationCode,
    redirect_uri = configService.getValue('ZOOM_APP_REDIRECT_URI'),
    pkceVerifier = undefined
) => {
    const params = {
        grant_type: 'authorization_code',
        code: zoomAuthorizationCode,
        redirect_uri,
    }

    if (typeof pkceVerifier === 'string') {
        params['code_verifier'] = pkceVerifier
    }

    const tokenRequestParamString = zoomHelpers.createRequestParamString(params)

    const a = await axios({
        url: `${configService.getValue('ZOOM_HOST')}/oauth/token`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: configService.getValue('ZOOM_APP_CLIENT_ID'),
            password: configService.getValue('ZOOM_APP_CLIENT_SECRET'),
        },
        data: tokenRequestParamString,
    })
    return a;
}

const refreshZoomAccessToken = async (zoomRefreshToken) => {
    const searchParams = new URLSearchParams()
    searchParams.set('grant_type', 'refresh_token')
    searchParams.set('refresh_token', zoomRefreshToken)

    return axios({
        url: `${configService.getValue('ZOOM_HOST')}/oauth/token?${searchParams.toString()}`,
        method: 'POST',
        auth: {
            username: configService.getValue('ZOOM_APP_CLIENT_ID'),
            password: configService.getValue('ZOOM_APP_CLIENT_SECRET'),
        },
    })
}

const getZoomUser = async (accessToken) => {
    return await axios({
        url: `${configService.getValue('ZOOM_HOST')}/v2/users/me`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export default {
    getZoomAccessToken,
    refreshZoomAccessToken,
    getZoomUser,
}
