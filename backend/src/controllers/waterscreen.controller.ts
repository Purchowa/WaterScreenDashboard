import express from 'express';
import Controller from "interfaces/controller.interface";

class WaterScreenController implements Controller {
    public path = '/waterscreen';
    public router = express();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
    }
}