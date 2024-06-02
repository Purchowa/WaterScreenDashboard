import express, { Response, Request } from 'express';

import Controller from "interfaces/controller.interface";
import WaterscreenStateService from '../modules/services/waterscreenState.service';
import ConfigService from '../modules/services/config.service';
import { WaterscreenStateModelType } from 'modules/models/waterscreenState.model';

export default class WaterScreenController implements Controller {
    public path = '/waterscreen';
    public router = express();
    private stateService = new WaterscreenStateService();
    private configService = new ConfigService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/config`, this.getConfig);
        this.router.post(`${this.path}/state`, this.postState);
    }

    private getConfig = (request: Request, response: Response) => {
        this.configService.getWaterscreenConfig()
            .then((cfg) => {
                if (cfg)
                    response.status(200).json(cfg) 
                else
                    response.status(404).json({ error: "Config not found" });
            })
            .catch((error) => { console.error(error); response.status(500).json({ error: "Internal error" }) });
    }

    private postState = (request: Request, response: Response) => {
        // TODO: add middleware for validation and also for BasicAuth.
        const newState: WaterscreenStateModelType = request.body;
        this.stateService.addState(newState)
            .then((addedValue) => response.status(200).json(addedValue))
            .catch((error) => { console.error(error); response.status(500).json({ error: "Couldn't add new state" }) });
    }
}