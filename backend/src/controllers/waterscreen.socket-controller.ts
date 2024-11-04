import { Server, Socket } from 'socket.io'

import SocketController from 'interfaces/socket-controller.interface';
import WaterscreenStateService from '../modules/services/waterscreenState.service';

export default class WaterScreenSocketController implements SocketController {
    private stateService = new WaterscreenStateService;

    public initializeEvents(io: Server) {
        io.on("connection", (socket: Socket) => {
            console.log("[sIO] got new connection");

            console.log("[sIO] initial transport", socket.conn.transport.name);

            socket.conn.once("upgrade", () => {
                // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
                console.log("[sIO] upgraded transport", socket.conn.transport.name);
            });

            socket.conn.on("close", (reason) => {
                console.log(`[sIO] connection closed, reason: ${reason}`)
            });

            socket.on("getState", () => {
                this.stateService.getLatestState()
                    .then((state) => {
                        if (state)
                            socket.emit('state', state);
                        else
                            socket.disconnect();
                    })
                    .catch((error) => {
                        console.error("Error getting latest state\n", error);
                        socket.disconnect(true);
                    });
            });
        });
        io.on("connection_error", (err) => console.error(err));
    }
}