import Chart from "chart.js/auto";
import "chartjs-adapter-moment";

const ctx = document.getElementById("bar-chart");

new Chart(ctx, {
    type: "bar",
    data: {
        labels: [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
        datasets: [
            {
                label: "# of Problems",
                data: [100, 80, 70, 65, 60, 50, 45, 35, 25],
                borderWidth: 1,
            },
        ],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

const atx = document.getElementById("line-chart");
let chart = new Chart(atx, {
    type: "line",
    data: {
        datasets: [
            {
                label: "Rating",
                data: [
                    {
                        x: "2023-07-09 00:00:00",
                        y: 0,
                    },
                    {
                        x: "2023-07-10 00:00:00",
                        y: 630,
                    },
                    {
                        x: "2023-07-11 00:00:00",
                        y: 650,
                    },
                    {
                        x: "2023-07-12 00:00:00",
                        y: 750,
                    },
                    {
                        x: "2023-07-13 00:00:00",
                        y: 850,
                    },
                    {
                        x: "2023-07-14 00:00:00",
                        y: 700,
                    },
                    {
                        x: "2023-07-15 00:00:00",
                        y: 900,
                    },
                    {
                        x: "2023-07-16 00:00:00",
                        y: 1000,
                    },
                    {
                        x: "2023-07-17 00:00:00",
                        y: 1100,
                    },
                    {
                        x: "2023-07-18 00:00:00",
                        y: 800,
                    },
                ],
            },
        ],
    },
});

async function loadData() {
    const data = await fetch("/api/user");
    const user = await data.json();
    document.getElementById("rating").innerText = user.rating;
    document.getElementById("contestCount").innerText = user.contestCount;
    document.getElementById("solvedProblemsCount").innerText = user.solvedProblemsCount;
}

await loadData();
