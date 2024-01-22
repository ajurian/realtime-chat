import { Typography } from "@mui/joy";

export default function LeaveRoomMessage({ username }: { username: string }) {
    return (
        <Typography sx={{ textAlign: "center" }}>
            {username} has left the room
        </Typography>
    );
}
