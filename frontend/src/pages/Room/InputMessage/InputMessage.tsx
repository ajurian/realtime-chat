import GuestMessage from "@/pages/Room/GuestMessage";
import { InputMessageProps } from "@/pages/Room/InputMessage/InputMessageProps";
import socket from "@/socket";
import randomId from "@/utils/randomId";
import { Box, Button, Textarea } from "@mui/joy";
import React, { useRef, useState } from "react";

export default function InputMessage({ user, setMessages }: InputMessageProps) {
    const [messageContent, setMessageContent] = useState("");
    const sendButtonRef = useRef<HTMLButtonElement>(null);

    const onMessageSend: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const id = randomId();

        socket.emit("message", { id, content: messageContent });

        setMessageContent("");
        setMessages((prevMessages) => {
            return {
                ...prevMessages,
                [id]: (
                    <GuestMessage
                        key={id}
                        username={user.username}
                        content={messageContent}
                        isClient
                        pending
                    />
                ),
            };
        });
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
        e
    ) => {
        // submit message if user pressed enter key
        // add new line if shift key is pressed
        if (["Enter", "NumpadEnter"].includes(e.key) && !e.shiftKey) {
            if (!e.shiftKey) {
                e.preventDefault();
                sendButtonRef.current?.click();
            }
        }
    };

    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                gap: 2,
            }}
            onSubmit={onMessageSend}
        >
            <Textarea
                maxRows={6}
                sx={{ flex: 1 }}
                value={messageContent}
                onChange={(e) => setMessageContent(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
            />
            <Button type="submit" ref={sendButtonRef}>
                Send
            </Button>
        </Box>
    );
}
