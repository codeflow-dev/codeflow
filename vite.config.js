import vituum from "vituum";
import posthtml from "@vituum/vite-plugin-posthtml";
import modules from "posthtml-modules";

export default {
    plugins: [
        vituum(),
        posthtml({
            root: "./src",
            plugins: [modules({ attributeAsLocals: true })],
        }),
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
};
