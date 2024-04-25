import { Response, Router } from "express";

import Controller from "interfaces/controller.interface";

export default class IndexController implements Controller {
    public path = '/';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public handleIndex(response: Response) {
        response.send("Hello it's WaterScreenAPI home page");
    }

    private initializeRoutes() {
        this.router.get(this.path, this.handleIndex);
    }
}