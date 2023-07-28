import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { cpp } from "@codemirror/lang-cpp";
import { Compartment } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

let language = new Compartment(),
    theme = new Compartment();

let editor = new EditorView({
    extensions: [basicSetup, language.of(cpp()), theme.of(oneDark), keymap.of(indentWithTab)],
    parent: document.getElementById("editor"),
});

document.getElementById("run").addEventListener("click", async (event) => {
    event.preventDefault();
    const code = editor.state.doc.text.join("\n");
    const language = document.getElementById("language").value;
    const input = document.getElementById("input").value;
    const r = await fetch("/api/playground", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language, input }),
    });
    const j = await r.json();
    document.getElementById("output").value = j.stdout;
});

document.getElementById("share").addEventListener("click", async (event) => {
    event.preventDefault();
    const code = editor.state.doc.text.join("\n");
    const language = document.getElementById("language").value;
    const r = await fetch("/api/code_share", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: code, language }),
    });
    const j = await r.json();
    document.getElementById("link").value = "http://localhost:3000/playground/"+j.id;
});

document.getElementById("copy").addEventListener("click", (event) => {
    navigator.clipboard.writeText(document.getElementById("link").value);
})

