import express from 'express'
import { config } from './config'
import Controller from 'interfaces/controller.interface';

export default class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeControllers(controllers);
    }

    public listen() {
        this.app.listen(config.port, () => console.log(`App listening on the port ${config.port}`));
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => this.app.use('/', controller.router));
    }
}