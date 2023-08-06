import Chart from "chart.js/auto";
import "chartjs-adapter-moment";
import moment from "moment";

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

let data = await (await fetch("/api/ratings")).json();
data = data.map((d) => ({ x: moment(new Date(d.contestDate)).format("YYYY-MM-DD HH:mm:ss"), y: d.rating }));

const atx = document.getElementById("line-chart");
let chart = new Chart(atx, {
    type: "line",
    data: {
        datasets: [
            {
                label: "Rating",
                data,
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
