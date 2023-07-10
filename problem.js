import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { cpp } from "@codemirror/lang-cpp";
import { Compartment } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

marked.use(markedKatex({ throwOnError: false }));
const html =
    marked.parse(`Happy PMP is freshman and he is learning about algorithmic problems. He enjoys playing algorithmic games a lot.

One of the seniors gave Happy PMP a nice game. He is given two permutations of numbers 1 through n and is asked to convert the first one to the second. In one move he can remove the last number from the permutation of numbers and inserts it back in an arbitrary position. He can either insert last number between any two consecutive numbers, or he can place it at the beginning of the permutation.

Happy PMP has an algorithm that solves the problem. But it is not fast enough. He wants to know the minimum number of moves to convert the first permutation to the second.

## Input

The first line contains a single integer $n$ ($1≤n≤2 \\cdot 10^5$) — the quantity of the numbers in the both given permutations.

Next line contains n space-separated integers — the first permutation. Each number between 1 to n will appear in the permutation exactly once.

Next line describe the second permutation in the same format.

Schrodinger's equation:

$$
i \\hbar \\frac{\\partial}{\\partial t} \\Psi = H \\Psi
$$

## Output

Print a single integer denoting the minimum number of moves required to convert the first permutation to the second.
`);

document.getElementById("statement").innerHTML = html;

let language = new Compartment(),
    theme = new Compartment();

let editor = new EditorView({
    extensions: [basicSetup, language.of(cpp()), theme.of(oneDark), keymap.of(indentWithTab)],
    parent: document.getElementById("editor"),
});
