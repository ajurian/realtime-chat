import { Typography } from "@mui/joy";

export default function JoinRoomMessage({ username }: { username: string }) {
    return (
        <Typography sx={{ textAlign: "center" }}>
            {username} has joined the room
        </Typography>
    );
}
