import express, { Response, Request } from 'express';

import Controller from "../interfaces/controller.interface";
import ConfigService from '../modules/services/config.service';
import { ConfigModelType } from '../modules/models/config.model';

export default class DashboardController implements Controller {
    public path = '/dashboard';
    public router = express();

    private configService = new ConfigService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get(`${this.path}/config`, this.getAllConfig);
        this.router.post(`${this.path}/config`, this.updateConfig);
    }

    private updateConfig = (request: Request, response: Response) => {
        const data: ConfigModelType = request.body; // TODO: add middleware

        this.configService.updateConfig(data)
            .then((updCfg) => response.status(200).json(updCfg))
            .catch((error) => { console.error(error); response.status(500).json({ error: "Can't update the config" }) });
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
}