/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./dashboard.html", "contests.html", "contests.html", "./assets/**/*.svg"],
    theme: {
        extend: {
            colors: {
                blue: {
                    200: "#1F2743",
                    300: "#1E293B",
                    400: "#131B2E",
                    500: "#151B31",
                    800: "#101425",
                },
                indigo: {
                    500: "#5450FF",
                },
            },
        },
    },
    plugins: [],
};
