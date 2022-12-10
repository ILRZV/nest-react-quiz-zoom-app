import * as crypto from "crypto";
import base64url from 'base64url';
import {configService} from "../../config/config";

const createRequestParamString = (params) => {
    const requestParams = new URLSearchParams()

    for (let param in params) {
        const value = params[param]
        requestParams.set(param, value)
    }

    return requestParams.toString()
}

const hmacBase64 = (str) =>
    crypto
        .createHmac('sha256', configService.getValue('ZOOM_APP_OAUTH_STATE_SECRET'))
        .update(str)
        .digest('base64')

const generateCodeVerifier = () => {
    return crypto.randomBytes(64).toString('hex')
}

const generateCodeChallenge = (codeVerifier) => {
    const base64Digest = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64')
    return base64url.fromBase64(base64Digest)
}

const generateState = () => {
    const ts = crypto.randomBytes(64).toString('hex')
    const hmac = hmacBase64(ts)
    return encodeURI([hmac, ts].join('.')).replace('+', '') // the replace is important because Auth0 encodes their returned state, eg with space instead of +
}


export default {
    createRequestParamString,
    generateCodeVerifier,
    generateCodeChallenge,
    generateState,
}
