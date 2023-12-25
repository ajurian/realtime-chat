import { extendTheme } from "@mui/joy";

const theme = extendTheme({
    cssVarPrefix: "css",
    spacing: (factor: number) => `${factor * 0.25}rem`,
    components: {
        JoyButton: {
            styleOverrides: {
                root: {
                    fontWeight: "normal",
                },
            },
        },
    },
});

export default theme;
