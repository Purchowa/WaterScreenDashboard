import { Server, Socket } from 'socket.io'

import { WaterScreenStateModel, getMockState } from '../models/WaterScreenStateModel';

export default class WaterScreenSocketController {

    constructor(private io: Server) { }

    public initializeRoutes() {
        this.io.on("connection", this.handleSocketConnection);
        this.io.on("connection_error", (err) => console.error(err));
    }

    private handleSocketConnection(socket: Socket) {
        socket.on("getState", () => { socket.emit('state', getMockState()); });
    }

}