import express from "express";
import { createServer } from "http";
import parseArgs from "minimist";
import { Server } from "socket.io";
import { ZodError } from "zod";
import {
    API_GET_USERS_FROM_ROOM_SCHEMA,
    MESSAGE_SCHEMA,
    USER_SCHEMA,
} from "./schema";
import { EmitEvents, ListenEvents, Message, User } from "./types";

const args = parseArgs(process.argv);
const port = args.port ?? 8080;
const portOrigin = args.portOrigin ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server<ListenEvents, EmitEvents, ListenEvents, User | null>(
    server,
    {
        cors: { origin: [`http://localhost:${portOrigin}`] },
    }
);

const ROOM_SOCKET_COUNT: Record<string, number> = {};

const onJoinRoom = (socketId: string, user: User) => {
    const socket = io.sockets.sockets.get(socketId);

    if (socket === undefined) {
        return;
    }

    try {
        const { room } = USER_SCHEMA.parse(user);

        socket.join(room);
        socket.data = user;

        io.to(room).emit("join_room", user, socket.id);

        if (ROOM_SOCKET_COUNT[room] === undefined) {
            ROOM_SOCKET_COUNT[room] = 1;
            socket.broadcast
                .except(Object.keys(ROOM_SOCKET_COUNT))
                .emit("create_room", room);
        } else {
            ROOM_SOCKET_COUNT[room] += 1;
        }
    } catch (e) {
        if (e instanceof ZodError) {
            console.log("Socket event: Data parsing error");
        }
    }
};

const onLeaveRoom = (socketId: string, user: User) => {
    const socket = io.sockets.sockets.get(socketId);

    if (socket === undefined) {
        return;
    }

    try {
        const { room } = USER_SCHEMA.parse(user);

        socket.leave(room);
        socket.data = null;
        io.to(room).emit("leave_room", user, socket.id);

        if (ROOM_SOCKET_COUNT[room] === 1) {
            delete ROOM_SOCKET_COUNT[room];
            socket.broadcast
                .except(Object.keys(ROOM_SOCKET_COUNT))
                .emit("abandom_room", room);
        } else {
            ROOM_SOCKET_COUNT[room] -= 1;
        }
    } catch (e) {
        if (e instanceof ZodError) {
            console.log("Socket event: Data parsing error");
        }
    }
};

const onMessage = (socketId: string, message: Message) => {
    const socket = io.sockets.sockets.get(socketId);

    if (socket === undefined || socket.data === null) {
        return;
    }

    try {
        MESSAGE_SCHEMA.parse(message);

        const user = socket.data;

        // send to all socekts in room
        // we include the sender so that it is informed
        // that message is sent succesfully
        io.to(user.room).emit("message", user, message, socketId);
    } catch (e) {
        if (e instanceof ZodError) {
            console.log("Socket event: Data parsing error");
        }
    }
};

io.on("connection", (socket) => {
    console.log(`Socket    connected: ${socket.id} |`);

    socket.data = null;

    socket.on("disconnecting", () => {
        if (socket.data !== null) {
            onLeaveRoom(socket.id, socket.data);
        }
    });

    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });

    socket.on("join_room", (user) => onJoinRoom(socket.id, user));
    socket.on("leave_room", (user) => onLeaveRoom(socket.id, user));
    socket.on("message", (message) => onMessage(socket.id, message));
});

app.get("/api/getGuestsFromRoom", async (req, res) => {
    try {
        const { room, socketId } =
            await API_GET_USERS_FROM_ROOM_SCHEMA.parseAsync(req.query);
        const targetSocket = io.sockets.sockets.get(socketId);

        if (targetSocket === undefined) {
            throw new Error();
        }

        // gets all the socket in a room excluding the targetSocket (who made request)
        const sockets = await targetSocket.to(room).fetchSockets();
        const guests = sockets.reduce<Record<string, User>>(
            (guests, socket) => {
                if (socket.data === null) {
                    throw new Error(
                        "Socket should have data if it's in a room"
                    );
                }

                guests[socket.id] = socket.data;
                return guests;
            },
            {}
        );

        res.status(200).send(guests);
    } catch (e) {
        console.error(e);
        res.status(400).end();
    }
});

app.get("/api/getRooms", async (req, res) => {
    try {
        res.status(200).send(Object.keys(ROOM_SOCKET_COUNT));
    } catch (e) {
        console.error(e);
        res.status(400).end();
    }
});

server.listen(port, () => {
    console.log("Listening on port", port);
});
