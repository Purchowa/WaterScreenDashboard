import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken';

import { config } from '../config';

const extractBearerToken = (headers: IncomingHttpHeaders) => {
    let token = headers['authorization'] || headers['x-access-token'];
    const bearerPrefix = 'Bearer ';

    if (token && typeof token === 'string') {
        if (token.startsWith(bearerPrefix)) {
            token = token.slice(bearerPrefix.length, token.length);
        }
        return token;
    }
    return undefined;
}

export const authJwt = (request: Request, response: Response, next: NextFunction) => {
    const token = extractBearerToken(request.headers);
    if (token) {
        try {
            jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
                if (err)
                    return response.status(401).send({ error: "invalid token" });
                else
                    next();
            })
        }
        catch (exception) {
            return response.status(401).send({ error: `error authorizing: ${exception}` });
        }

    }
    else {
        return response.status(401).send({ error: "access denied. No token provided" });
    }
}