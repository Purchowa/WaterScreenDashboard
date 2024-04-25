import express from 'express';
import Controller from "interfaces/controller.interface";

class Dashboard implements Controller {
    public path = '/dashboard';
    public router = express();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

    }
}