// MUST be the very first import in main.ts.
// monaco-vscode-api packages read `process.env` at import time and crash in the
// browser without this shim. We use `any` casts to avoid clashing with @types/node.
const g = globalThis as any;
if (typeof g.process === "undefined") {
  g.process = { env: {} };
} else if (typeof g.process.env === "undefined") {
  g.process.env = {};
}
export {};
