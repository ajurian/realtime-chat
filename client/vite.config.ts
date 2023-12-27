import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            "/api": "http://localhost:3001",
        },
    },
    preview: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:8080",
        },
    },
    plugins: [react(), tsConfigPaths()],
});
