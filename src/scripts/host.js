import Alpine from "alpinejs";
document.addEventListener("alpine:init", () => {
    Alpine.data("contest", () => ({
        init() {
            const dt = new Date();
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            this.contestDate = dt.toISOString().slice(0, 16);
        },
        contestDate: "",
        duration: "02:30",
        problems: [
            {
                id: "A",
                title: "",
                statement: "",
                testCases: [],
                samples: 0,
                checker: "",
            },
            {
                id: "B",
                title: "",
                statement: "",
                testCases: [],
                samples: 0,
                checker: "",
            },
            {
                id: "C",
                title: "",
                statement: "",
                testCases: [],
                samples: 0,
                checker: "",
            },
            {
                id: "D",
                title: "",
                statement: "",
                testCases: [],
                samples: 0,
                checker: "",
            },
            {
                id: "E",
                title: "",
                statement: "",
                testCases: [],
                samples: 0,
                checker: "",
            },
        ],
        active: "A",
        level: "Beginner",

        getFile(id, inout) {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.addEventListener("change", (event) => this.readInputFile(id, inout));
            fileInput.click();
        },

        readInputFile(id, inout) {
            const file = event.target.files[0];

            if (!file) {
                console.log("No file selected.");
                return;
            }

            const reader = new FileReader();

            reader.onload = (event) => {
                const index = id.charCodeAt(0) - "A".charCodeAt(0);
                const inputs = event.target.result.split("\n\n");
                if (this.problems[index].testCases.length == 0) {
                    for (let i = 0; i < inputs.length; i++) {
                        if (inout == "in") {
                            this.problems[index].testCases.push({ input: inputs[i] });
                        } else {
                            this.problems[index].testCases.push({ output: inputs[i] });
                        }
                    }
                } else {
                    for (let i = 0; i < inputs.length; i++) {
                        if (inout == "in") {
                            this.problems[index].testCases[i].input = inputs[i];
                        } else {
                            this.problems[index].testCases[i].output = inputs[i];
                        }
                    }
                }
            };
            reader.readAsText(file);
        },
        async submitForm() {
            const { level, problems } = this;
            const contestDate = new Date(this.contestDate).getTime();
            const [h, m] = this.duration.split(":");
            const duration = (parseInt(h, 10) * 60 + parseInt(m, 10)) * 60 * 1000;
            const response = await fetch("/api/contests", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    level,
                    problems,
                    contestDate,
                    duration,
                }),
            });
            if (response.status == 200) {
                window.location = "/contests.html";
            }
        },
    }));
});
Alpine.start();
