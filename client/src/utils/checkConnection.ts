import { Socket } from "socket.io-client";

export default function checkConnection(socket: Socket) {
    if (socket.connected) {
        return;
    }

    socket.connect();
}
