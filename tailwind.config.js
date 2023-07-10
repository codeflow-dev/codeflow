/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./assets/**/*.svg"],
    theme: {
        extend: {
            colors: {
                blue: {
                    200: "#1F2743",
                    300: "#1D2543",
                    400: "#131B2E",
                    500: "#151B31",
                    600: "#12172C",
                    800: "#101425",
                },
                indigo: {
                    500: "#5450FF",
                },
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
