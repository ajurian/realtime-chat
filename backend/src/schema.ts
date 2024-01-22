import { z } from "zod";

export const USER_SCHEMA = z.object({
    username: z
        .string()
        .min(4, "Username must atleast have 4 characters")
        .max(16, "Username must not exceed 16 characters"),
    room: z
        .string()
        .min(4, "Room must atleast have 4 characters")
        .max(16, "Room must not exceed 16 characters"),
});

export const MESSAGE_SCHEMA = z.object({
    id: z.string().length(21),
    content: z.string(),
});

export const API_GET_USERS_FROM_ROOM_SCHEMA = z.object({
    room: z.string().min(4).max(16),
    socketId: z.string().length(20),
});
