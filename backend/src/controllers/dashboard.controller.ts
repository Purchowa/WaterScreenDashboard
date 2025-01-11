import express, { Response, Request } from 'express';
import { Error } from 'mongoose'

import Controller from "../interfaces/controller.interface";

import ConfigService from '../modules/services/config.service';
import JwtTokenService from '../modules/services/jwtToken.service';
import UserService from '../modules/services/user.service';

import { ConfigModelType } from '../modules/models/config.model';
import { UserModelType } from '../modules/models/user.model';
import { PictureDataType } from '../modules/models/picture.model';

import WaterscreenStateService from "../modules/services/waterscreenState.service";
import WebPictureService from '../modules/services/webPicture.service';

import { authJwt } from '../middlewares/auth.middleware';

export default class DashboardController implements Controller {
    public path = '/dashboard';
    public router = express();

    private configService = new ConfigService();
    private jwtService = new JwtTokenService();
    private userService = new UserService();
    private stateService = new WaterscreenStateService();
    private webPictureService = new WebPictureService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get(`${this.path}/config`, authJwt, this.getAllConfig);
        this.router.post(`${this.path}/config`, authJwt, this.updateConfig);
        this.router.post(`${this.path}/login`, this.login);
        this.router.get(`${this.path}/state`, authJwt, this.getState);
        this.router.post(`${this.path}/webPicture`, authJwt, this.updateWebPicture);
        this.router.get(`${this.path}/webPicture`, authJwt, this.getWebPicture);
    }

    private updateConfig = (request: Request, response: Response) => {
        const data: ConfigModelType = request.body;
        this.configService.updateConfig(data)
            .then((updCfg) => response.status(200).json(updCfg))
            .catch((error: Error.ValidationError) => { response.status(400).json(error); })
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

    private getState = (request: Request, response: Response) => {
        this.stateService.getLatestState()
            .then((state) => {
                if (state)
                    response.status(200).json(state);
                else
                    response.status(404).json({ error: "State not found" });
            })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }) });
    }

    private updateWebPicture = (request: Request, response: Response) => {
        const data: PictureDataType = request.body;
        this.webPictureService.updateWebPicture(data)
            .then((updData) => response.status(200).json(updData))
            .catch((error: Error.ValidationError) => { response.status(400).json(error); })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }) });
    }

    private getWebPicture = (request: Request, response: Response) => {
        this.webPictureService.getWebPicture()
            .then((webPicture) => {
                if (webPicture)
                    response.status(200).json(webPicture);
                else
                    response.status(404).json({ error: "WebPicture not found" });
            })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }); });
    }
}
