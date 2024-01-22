import { z } from "zod";
import { MESSAGE_SCHEMA, USER_SCHEMA } from "./schema";

type User = z.infer<typeof USER_SCHEMA>;
type Message = z.infer<typeof MESSAGE_SCHEMA>;

type ListenEvents = {
    join_room: (user: User) => void;
    leave_room: (user: User) => void;
    message: (message: Message) => void;
};

type EmitEvents = {
    create_room: (room: string) => void;
    abandom_room: (room: string) => void;
    join_room: (user: User, socketId: string) => void;
    leave_room: (user: User, socketId: string) => void;
    message: (user: User, message: Message, socketId: string) => void;
};
