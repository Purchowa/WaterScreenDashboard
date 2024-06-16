import express, { Response, Request } from 'express';
import { Error } from 'mongoose'

import Controller from "../interfaces/controller.interface";

import ConfigService from '../modules/services/config.service';
import JwtTokenService from '../modules/services/jwtToken.service';
import UserService from '../modules/services/user.service';

import { ConfigModelType } from '../modules/models/config.model';
import { UserModelType } from '../modules/models/user.model';
import { authJwt } from '../middlewares/auth.middleware';

export default class DashboardController implements Controller {
    public path = '/dashboard';
    public router = express();

    private configService = new ConfigService();
    private jwtService = new JwtTokenService();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get(`${this.path}/config`, authJwt, this.getAllConfig);
        this.router.post(`${this.path}/config`, authJwt, this.updateConfig);
        this.router.post(`${this.path}/login`, this.login);
    }

    private updateConfig = (request: Request, response: Response) => {
        const data: ConfigModelType = request.body;

        this.configService.updateConfig(data)
            .then((updCfg) => response.status(200).json(updCfg))
            .catch((error: Error.ValidationError) => { response.status(400).json(error) })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }) });
    }

    private getAllConfig = (request: Request, response: Response) => {
        this.configService.getAllConfig()
            .then((cfg) => {
                if (cfg)
                    response.status(200).json(cfg)
                else
                    response.status(404).json({ error: "Config not found" });
            })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }) });
    }

    private login = (request: Request, response: Response) => {
        const incomingUser: UserModelType = request.body;
        this.userService.isValidUser(incomingUser)
            .then((isValid) => {
                if (isValid) {
                    this.jwtService.create(incomingUser.username)
                        .then((token) => { response.status(200).json({ token: token }) });
                }
                else {
                    response.status(401).json({ error: "invalid credentials" });
                }
            })
            .catch((error: Error.ValidationError) => { response.status(401).json({ error: "user not found" }) })
            .catch((error) => { response.status(500).json({ error: "internal error" }) });
    }
}