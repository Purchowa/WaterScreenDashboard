import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import JSONbig from 'json-bigint';

import { config } from './config';
import Controller from './interfaces/controller.interface';
import SocketController from './interfaces/socket-controller.interface';


export default class App {
    private app: express.Application;
    private httpServer: http.Server;
    private io: Server;

    constructor(controllers: Controller[], sockets: SocketController[]) {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.io = new Server(this.httpServer, {
            path: `${config.API_ROOT_URI}/socket.io/`,
            cors: {
                origin: config.CORS_ORIGIN,
                methods: ['GET', 'POST'],
            },
        });

        this.connectToDatabase();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeSockets(sockets);
    }

    public listen() {
        this.httpServer.listen(config.PORT, () => {
            console.log(`App listening on the port ${config.PORT}`);
        });
    }

    private initializeMiddleware() {
        const corsOptions = {
            origin: config.CORS_ORIGIN,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            optionsSuccessStatus: 200
        };
        this.app.use(cors(corsOptions));

        this.app.use(bodyParser.text({ type: 'application/json' }));
        this.app.use((req, res, next) => {
            if (req.is('application/json') && typeof req.body === 'string') {
                try {
                    req.body = JSONbig.parse(req.body);
                } catch (err) {
                    return res.status(400).send({ error: 'Invalid JSON' });
                }
            }
            next();
        });
        this.app.use(morgan('dev'));
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => this.app.use(`${config.API_ROOT_URI}/`, controller.router));
    }

    private initializeSockets(socketControllers: SocketController[]) {
        socketControllers.forEach((socket) => socket.initializeEvents(this.io));
    }

    private connectToDatabase() {
        mongoose.connect(config.MONGO_DB_URI)
            .then(() => console.log("Connection with MongoDB established"))
            .catch((error) => console.error("Error connecting to MongoDB: ", error));

        mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));
        mongoose.connection.on("error", (error) => console.error("MongoDB error: ", error));

        const externalTermination = async () => {
            await mongoose.connection.close();
            console.log("MongoDB connection closed due to app termination");
            process.exit(0);
        };

        process.on("SIGINT", externalTermination);
        process.on("SIGTERM", externalTermination);
    }
}
