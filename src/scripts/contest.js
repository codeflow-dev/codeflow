import Route from "route-parser";
import Alpine from "alpinejs";

const route = new Route("/contest/:id");

function getId() {
    return route.match(window.location.pathname).id;
}

document.addEventListener("alpine:init", () => {
    Alpine.data("contest", () => ({
        async init() {
            try {
                const c = await fetch(`/api/contest/${getId()}`, {});
                const j = await c.json();
                this.contest = j;
            } catch (err) {
                console.error(err);
            }
        },
        contest: {},
    }));
});

Alpine.start();
