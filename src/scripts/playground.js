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
    console.log(code);
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
