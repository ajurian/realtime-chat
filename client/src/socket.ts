import { EmitEvents, ListenEvents } from "@/types";
import { Socket, io } from "socket.io-client";

const socket: Socket<ListenEvents, EmitEvents> = io("http://localhost:3001", {
    autoConnect: false,
});

export default socket;
