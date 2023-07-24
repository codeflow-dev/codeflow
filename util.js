import assert from "node:assert";

export function assertString(a) {
    assert.equal(typeof a, "string");
}

export function assertStringArray(a) {
    for (let i = 0; i < a.length; i++) {
        assertString(a[i]);
    }
}
