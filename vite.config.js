import vituum from "vituum";
import posthtml from "@vituum/vite-plugin-posthtml";
import modules from "posthtml-modules";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        vituum(),
        posthtml({
            root: "./src",
            plugins: [modules({ attributeAsLocals: true })],
        }),
        {
            name: "postbuild",
            closeBundle: async () => {
                console.log("http://localhost:3000");
            },
        },
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
    build: {
        watch: {
            include: "src/**/*",
        },
    },
});
