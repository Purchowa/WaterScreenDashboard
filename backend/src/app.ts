import express from 'express'
import * as http from 'http';
import { Server } from 'socket.io';

import { config } from './config'
import Controller from './interfaces/controller.interface';
import WaterScreenSocketController from './controllers/waterscreen.socket-controller';


export default class App {
    public app: express.Application;
    public httpServer: http.Server;
    public io: Server;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.io = new Server(this.httpServer, {
            cors: {
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST'],
            },
        });

        this.initializeControllers(controllers);
        this.initializeSockets();
    }

    public listen() {
        this.httpServer.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });

    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => this.app.use('/', controller.router));
    }

    private initializeSockets() {
        const waterscreenState = new WaterScreenSocketController(this.io);
        waterscreenState.initializeRoutes();
    }
}