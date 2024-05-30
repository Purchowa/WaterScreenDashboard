import express, { Response, Request } from 'express';

import Controller from "interfaces/controller.interface";
import WaterscreenStateService from '../modules/services/waterscreenState.service';
import { WaterscreenStateModel } from 'modules/models/waterscreenState.model';

export default class WaterScreenController implements Controller {
    public path = '/waterscreen';
    public router = express();
    private stateService = new WaterscreenStateService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.get(`${this.path}/config`, this.getConfig);
        this.router.post(`${this.path}/state`, this.postState);
    }

    private getConfig = (request: Request, response: Response) => {
        this.stateService.getLatestState() // Wrong data xD
            .then((state) => {
                if (state)
                    response.status(200).json(state);
                else
                    response.status(404).json({ error: 'Waterscreen state history is not present' });
            })
            .catch((error) => {
                console.error("Error getting latest state: ", error);
                response.status(500);
            });
    }

    private postState = (request: Request, response: Response) => {
        // TODO: add middleware for validation and also for BasicAuth.
        const newState: WaterscreenStateModel = request.body;
        this.stateService.addState(newState)
            .then((addedValue) => response.status(200).json(addedValue))
            .catch((error) => { console.error(error); response.status(500).json({ error: "Couldn't add new state" }) });
    }
}