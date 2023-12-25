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

export const GUEST_RECORD_SCHEMA = z.record(USER_SCHEMA);

export const EVENT_MESSAGE_SCHEMA = z.object({
    user: USER_SCHEMA,
    message: z
        .string()
        .min(1, "Atleast 1 character is required to send a message"),
});
