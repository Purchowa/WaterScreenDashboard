import express, { Response, Request, response } from 'express';
import basicAuth from 'express-basic-auth';
import { Error } from 'mongoose'
import JSONbig from 'json-bigint';

import { config } from '../config';
import Controller from "interfaces/controller.interface";

import WaterscreenStateService from '../modules/services/waterscreenState.service';
import ConfigService from '../modules/services/config.service';
import WebPictureService from '../modules/services/webPicture.service';

import { WaterscreenStateModelType } from 'modules/models/waterscreenState.model';

import { handleLowWaterMailNotification } from '../middlewares/mail.middleware'; 

export default class WaterScreenController implements Controller {
    public path = '/waterscreen';
    public router = express();

    private stateService = new WaterscreenStateService();
    private configService = new ConfigService();
    private webPictureService = new WebPictureService();

    private protected = basicAuth({ users: { [config.WATERSCREEN_USER]: config.WATERSCREEN_PASS } });

    constructor() {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router.get(`${this.path}/config`, this.protected, this.getConfig);
        this.router.post(`${this.path}/state`, this.protected, this.postState);
        this.router.get(`${this.path}/webPicture/wasRead`, this.protected, this.getWebPictureReadState);
        this.router.get(`${this.path}/webPicture`, this.protected, this.getWebPicture);
    }

    private getConfig = (request: Request, response: Response) => {
        this.configService.getWaterscreenConfig()
            .then((cfg) => {
                if (cfg)
                    response.status(200).json(cfg) 
                else
                    response.status(404).json({ error: "Config not found" });
            })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }); });
    }

    private postState = (request: Request, response: Response) => {
        const newState: WaterscreenStateModelType = request.body;
        this.stateService.addState(newState)
            .then((addedValue) => { response.status(200).json(addedValue); handleLowWaterMailNotification(request); })
            .catch((error: Error.ValidationError) => { response.status(400).json(error) })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Couldn't add new state" }) });
    }

    private getWebPictureReadState = (request: Request, response: Response) => {
        this.webPictureService.wasWebPictureRead()
            .then((wasRead) => {
                if (wasRead !== undefined)
                    response.status(200).json(wasRead);
                else
                    response.status(404).json({ error: "WebPicture not found" });
            })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }); })
    }

    private getWebPicture = (request: Request, response: Response) => {
        this.webPictureService.getWebPicture()
            .then((webPicture) => {
                if (webPicture) {
                    webPicture.data = webPicture.data?.map((value) => { return typeof value === "string" ? BigInt(value) : BigInt(0); });
                    response.status(200);
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSONbig.stringify(webPicture));
                }
                else
                    response.status(404).json({ error: "WebPicture not found" });
            })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }); });
    }

}