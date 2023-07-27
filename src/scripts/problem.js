import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { cpp } from "@codemirror/lang-cpp";
import { Compartment } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import Alpine from "alpinejs";
import Route from "route-parser";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const route = new Route("/problem/:id");

marked.use(
    markedKatex({
        throwOnError: false,
    })
);

function getId() {
    return route.match(window.location.pathname).id;
}

document.addEventListener("alpine:init", () => {
    Alpine.data("problem", () => ({
        async init() {
            try {
                const c = await fetch(`/api/problem/${getId()}`, {});
                const j = await c.json();
                this.problem = j;
            } catch (err) {
                console.error(err);
            }
        },
        problem: {},
        statement() {
            if (this.problem.statement) {
                return marked.parse(this.problem.statement);
            } else {
                return "";
            }
        },
    }));
});

Alpine.start();

let language = new Compartment(),
    theme = new Compartment();

let editor = new EditorView({
    extensions: [basicSetup, language.of(cpp()), theme.of(oneDark), keymap.of(indentWithTab)],
    parent: document.getElementById("editor"),
});

document.getElementById("submitCode").addEventListener("click", async (event) => {
    event.preventDefault();
    const r = await fetch("/api/submission", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code: editor.state.doc.text.join("\n"),
            language: document.getElementById("lang").value,
            id: getId(),
        }),
    });
    const j = await r.json();
    document.getElementById("message").innerText = j.message;
    document.getElementById("message").style.visibility = "visible";
    Toastify({
        text: j.message,
        duration: 5000,
    }).showToast();
});
