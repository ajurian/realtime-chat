import { Box, Typography } from "@mui/joy";

export default function GuestMessage({
    username,
    content,
    pending,
    isClient,
}: GuestMessageProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "32rem",
                alignSelf: isClient ? "end" : "start",
            }}
        >
            <Typography
                level="title-sm"
                sx={{
                    fontWeight: "bold",
                    textAlign: isClient ? "right" : "left",
                }}
            >
                {username}
            </Typography>
            <Typography
                component="pre"
                level="body-sm"
                sx={{
                    opacity: pending ? 0.25 : 1,
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                }}
            >
                {content}
            </Typography>
        </Box>
    );
}
