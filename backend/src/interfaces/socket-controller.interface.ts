import { Server } from 'socket.io'
export default interface SocketController {
    initializeEvents: (io: Server) => void;
}