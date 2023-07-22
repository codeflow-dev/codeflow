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

const route = new Route("/problem/:id");

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
                console.log(this.problem);
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
