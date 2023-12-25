import { Avatar, Box, Typography } from "@mui/joy";

export default function Guest({ username, isClient }: GuestProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar variant="solid" size="sm" />
            <Typography
                level="title-sm"
                sx={{ fontWeight: isClient ? "bold" : "inherit" }}
            >
                {username}
            </Typography>
        </Box>
    );
}
