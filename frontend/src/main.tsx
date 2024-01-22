import App from "@/App";
import theme from "@/theme";
import "@fontsource/inter";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <App />
        </CssVarsProvider>
    </React.StrictMode>
);
