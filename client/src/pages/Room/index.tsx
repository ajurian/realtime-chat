import Guest from "@/pages/Room/Guest";
import GuestMessage from "@/pages/Room/GuestMessage";
import InputMessage from "@/pages/Room/InputMessage";
import JoinRoomMessage from "@/pages/Room/JoinRoomMessage";
import LeaveRoomMessage from "@/pages/Room/LeaveRoomMessage";
import { RoomProps } from "@/pages/Room/RoomProps";
import { GUEST_RECORD_SCHEMA } from "@/schema";
import socket from "@/socket";
import { ListenEvents, User } from "@/types";
import checkConnection from "@/utils/checkConnection";
import randomId from "@/utils/randomId";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Sheet,
    Typography,
} from "@mui/joy";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function Room({ user, setUser }: RoomProps) {
    const [guests, setGuests] = useState<Record<string, User>>({});
    const [messages, setMessages] = useState<Record<string, React.ReactNode>>({
        [randomId()]: (
            <JoinRoomMessage key={socket.id} username={user.username} />
        ),
    });
    const [isLoadingGuests, setIsLoadingGuests] = useState(true);

    const guestEntries = useMemo(() => Object.entries(guests), [guests]);
    const messageValues = useMemo(() => Object.values(messages), [messages]);

    const leaveRoom = () => {
        socket.emit("leave_room", user);
        setUser(null);
    };

    useEffect(() => {
        checkConnection(socket);

        const source = axios.CancelToken.source();

        const fetchGuestsFromRoom = async () => {
            setIsLoadingGuests(true);

            try {
                const result = await axios.get("/api/getGuestsFromRoom", {
                    params: { room: user.room, socketId: socket.id },
                    cancelToken: source.token,
                });
                const guests = await GUEST_RECORD_SCHEMA.parseAsync(
                    result.data
                );

                setGuests(guests);
            } catch (e) {
                if (!axios.isCancel(e)) {
                    console.error(e);
                }
            }

            setIsLoadingGuests(false);
        };

        const onJoinRoom: ListenEvents["join_room"] = (
            { username, room },
            socketId
        ) => {
            setGuests((guests) => ({
                ...guests,
                [socketId]: { username, room },
            }));

            setMessages((prevMessages) => {
                const id = randomId();
                return {
                    ...prevMessages,
                    [id]: <JoinRoomMessage key={id} username={username} />,
                };
            });
        };

        const onLeaveRoom: ListenEvents["leave_room"] = (
            { username },
            socketId
        ) => {
            setGuests((guests) => {
                const newGuests = { ...guests };
                delete newGuests[socketId];
                return newGuests;
            });

            setMessages((prevMessages) => {
                const id = randomId();
                return {
                    ...prevMessages,
                    [id]: <LeaveRoomMessage key={id} username={username} />,
                };
            });
        };

        const onMessage: ListenEvents["message"] = (
            user,
            message,
            socketId
        ) => {
            setMessages((prevMessages) => {
                return {
                    ...prevMessages,
                    [message.id]: (
                        <GuestMessage
                            key={message.id}
                            username={user.username}
                            content={message.content}
                            isClient={socket.id === socketId}
                        />
                    ),
                };
            });
        };

        fetchGuestsFromRoom();

        socket.on("join_room", onJoinRoom);
        socket.on("leave_room", onLeaveRoom);
        socket.on("message", onMessage);

        return () => {
            socket.off("join_room", onJoinRoom);
            socket.off("leave_room", onLeaveRoom);
            socket.off("message", onMessage);
            source.cancel();
        };
    }, [user.room]);

    return (
        <Sheet
            component="main"
            sx={{
                display: "flex",
                minHeight: "100vh",
            }}
        >
            <Sheet
                sx={{
                    flexBasis: "100%",
                    maxWidth: "16rem",
                    wordWrap: "break-word",
                    p: 2,
                    gap: 4,
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "100vh",
                    overflow: "hidden",
                }}
            >
                <Typography>Room: {user.room}</Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        overflow: "auto",
                    }}
                >
                    <Guest username={user.username} isClient />
                    {isLoadingGuests ? (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress variant="plain" size="sm" />
                        </Box>
                    ) : (
                        guestEntries.map(([socketId, user]) => (
                            <Guest key={socketId} username={user.username} />
                        ))
                    )}
                </Box>
                <Button sx={{ mt: "auto" }} onClick={leaveRoom}>
                    Leave room
                </Button>
            </Sheet>
            <Divider orientation="vertical" />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 2,
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        flexBasis: "64rem",
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            gap: 2,
                        }}
                    >
                        {messageValues}
                    </Box>
                    <InputMessage user={user} setMessages={setMessages} />
                </Box>
            </Box>
        </Sheet>
    );
}
