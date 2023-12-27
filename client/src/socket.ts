import { EmitEvents, ListenEvents } from "@/types";
import { Socket, io } from "socket.io-client";

const socket: Socket<ListenEvents, EmitEvents> = io(
    `http://localhost:${import.meta.env.VITE_PROXY_PORT}`,
    {
        autoConnect: false,
    }
);

export default socket;
