import Alpine from "alpinejs";

document.addEventListener("alpine:init", () => {
    Alpine.data("current", () => ({
        async init() {
            try {
                const c = await fetch("/api/contests/current");
                const j = await c.json();
                this.contestName = j[0].contestName;
                this.problems = j[0].problems;
                this.contestDate = j[0].contestDate;
                this.duration = j[0].duration;
                this.updateCountdown();
            } catch (err) {
                this.contestName = "";
            }
        },
        contestName: "",
        problems: [],
        contestDate: "",
        duration: 0,
        countdown: "Calculating...",
        updateCountdown() {
            const endDate = new Date(this.contestDate).getTime() + this.duration;
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const remainingTime = endDate - now;
                if (remainingTime <= 0) {
                    this.countdown = "Contest has ended.";
                    clearInterval(interval);
                } else {
                    this.countdown = this.formatTime(remainingTime);
                }
            }, 1000);
        },
        formatTime(time) {
            const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((time % (1000 * 60)) / 1000);

            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`;
        },
    }));
});

Alpine.start();
