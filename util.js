import assert from "node:assert";

export function assertString(a) {
    assert.equal(typeof a, "string");
}

export function assertStringArray(a) {
    for (let i = 0; i < a.length; i++) {
        assertString(a[i]);
    }
}
// export function assertStringArray(a) {
//     if (!Array.isArray(a)) {
//       throw new Error("Input must be an array.");
//     }
  
//     for (let i = 0; i < a.length; i++) {
//       if (typeof a[i] !== "string" || a[i].trim().length === 0) {
//         throw new Error("All elements in the array must be non-empty strings.");
//       }
//     }
//   }
// export function assertStringArray(a) {
//     for (let i = 0; i < a.length; i++) {
//         if (typeof a[i] !== "string" || a[i].trim() === "") {
//             throw new Error("All elements in the array must be non-empty strings.");
//         }
//     }
// }
// util.js
// export function assertStringArray(arr) {
//     if (!Array.isArray(arr)) {
//       throw new Error("Input is not an array");
//     }
  
//     for (const element of arr) {
//       if (typeof element !== "string" || element.trim().length === 0) {
//         throw new Error("All elements in the array must be non-empty strings");
//       }
//     }
//   }
  