import vituum from "vituum";
import posthtml from "@vituum/vite-plugin-posthtml";

export default {
    plugins: [
        vituum(),
        posthtml({
            root: "./src",
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
