import FormContainer from "@/pages/Home/FormContainer";
import socket from "@/socket";
import { ListenEvents } from "@/types";
import { Autocomplete, Box, Button, Input, Sheet, Typography } from "@mui/joy";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Home({ setUser }: HomeProps) {
    const [usernameInput, setUsernameInput] = useState("");
    const [roomInput, setRoomInput] = useState("");
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [options, setOptions] = useState<string[]>([]);

    const joinRoom: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        // join room and broadcast to other sockets
        // that is in the same room
        socket.emit("join_room", {
            username: usernameInput,
            room: roomInput,
        });
    };

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const source = axios.CancelToken.source();

        const fetchRooms = async () => {
            try {
                const result = await axios.get("/api/getRooms", {
                    cancelToken: source.token,
                });
                const rooms = await z.string().array().parseAsync(result.data);
                setOptions(rooms);
            } catch (e) {
                if (!axios.isCancel(e)) {
                    console.error(e);
                }
            }
        };

        const onConnect = () => {
            setIsConnected(socket.connected);
        };

        // someone created room, show the room id to the home page
        const onCreateRoom: ListenEvents["create_room"] = (room) => {
            setOptions((options) => [...options, room]);
        };

        // room has no guests
        const onAbandonRoom: ListenEvents["abandom_room"] = (room) => {
            setOptions((options) => {
                const newOptions = [...options];
                const index = newOptions.indexOf(room);

                if (index > -1) {
                    newOptions.splice(index, 1);
                }

                return newOptions;
            });
        };

        // inform the client that he successfully joined the room
        const onJoinRoom: ListenEvents["join_room"] = (
            { username, room },
            socketId
        ) => {
            if (socket.id === socketId) {
                setUser({ username, room });
            }
        };

        fetchRooms();

        socket.on("connect", onConnect);
        socket.on("create_room", onCreateRoom);
        socket.on("join_room", onJoinRoom);
        socket.on("abandom_room", onAbandonRoom);

        return () => {
            socket.off("connect", onConnect);
            socket.off("create_room", onCreateRoom);
            socket.off("join_room", onJoinRoom);
            socket.off("abandom_room", onAbandonRoom);
            source.cancel();
        };
    }, [setUser]);

    return (
        <Sheet
            component="main"
            sx={{
                display: "grid",
                placeItems: "center",
                minHeight: "100vh",
            }}
            variant="soft"
        >
            <FormContainer>
                <Typography level="h4" textAlign="center">
                    Enter a room
                </Typography>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        maxWidth: "24rem",
                        gap: 4,
                        p: 4,
                        mt: 2,
                    }}
                    onSubmit={joinRoom}
                >
                    <Input
                        placeholder="Username"
                        value={usernameInput}
                        onChange={(e) =>
                            setUsernameInput(e.currentTarget.value)
                        }
                        sx={{ flexGrow: 1 }}
                    />
                    <Autocomplete
                        freeSolo
                        disableClearable
                        value={roomInput}
                        options={options}
                        placeholder="Room"
                        onInputChange={(_, value) => setRoomInput(value)}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        type="submit"
                        disabled={!isConnected}
                        sx={{ flexGrow: 1 }}
                    >
                        Join
                    </Button>
                </Box>
            </FormContainer>
        </Sheet>
    );
}
