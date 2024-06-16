import jwt from "jsonwebtoken";

import { config } from "../../config";

export default class JwtTokenService {
    public async create(username: string) {
        const token = jwt.sign({ username: username }, config.JWT_SECRET, { expiresIn: '30m' });
        return token;
    }
}