import vituum from "vituum";
import posthtml from "@vituum/vite-plugin-posthtml";
import modules from "posthtml-modules";
import { defineConfig } from "vite";

const routePlugin = () => ({
    name: "route-html",
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (!req.originalUrl.endsWith(".html")) {
                req.originalUrl += ".html";
            }
            next();
        });
    },
});

export default defineConfig({
    plugins: [
        vituum(),
        posthtml({
            root: "./src",
            plugins: [modules({ attributeAsLocals: true })],
        }),
        routePlugin(),
    ],
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
            },
        },
    },
});
