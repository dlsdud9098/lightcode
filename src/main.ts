// 1. Must come first — shims `process.env` before any monaco-vscode-api import.
import "./workerSetupEntry";

// 2. Default extensions (themes + a couple of grammars). Add more as needed.
import "@codingame/monaco-vscode-theme-defaults-default-extension";

import * as monaco from "monaco-editor";
import { initialize } from "@codingame/monaco-vscode-api";

import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getExtensionsServiceOverride from "@codingame/monaco-vscode-extensions-service-override";
import getFilesServiceOverride from "@codingame/monaco-vscode-files-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";

// --- Workers ---------------------------------------------------------------
type WorkerLoader = () => Worker;
const workerLoaders: Record<string, WorkerLoader> = {
  TextEditorWorker: () =>
    new Worker(new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url), {
      type: "module",
    }),
  TextMateWorker: () =>
    new Worker(
      new URL("@codingame/monaco-vscode-textmate-service-override/worker", import.meta.url),
      { type: "module" }
    ),
};

(self as any).MonacoEnvironment = {
  getWorker(_moduleId: string, label: string) {
    const loader = workerLoaders[label];
    if (loader) return loader();
    throw new Error(`Worker not found: ${label}`);
  },
};

// --- Boot ------------------------------------------------------------------
async function boot() {
  await initialize({
    ...getConfigurationServiceOverride(),
    ...getExtensionsServiceOverride(),
    ...getFilesServiceOverride(),
    ...getKeybindingsServiceOverride(),
    ...getLanguagesServiceOverride(),
    ...getTextmateServiceOverride(),
    ...getThemeServiceOverride(),
  });

  // Replace splash with the editor.
  const splash = document.getElementById("splash");
  if (splash) splash.remove();

  monaco.editor.create(document.getElementById("workbench")!, {
    value: [
      "// Lightcode v2 — Tauri + monaco-vscode-api",
      "// Open VSX 마켓플레이스 + VSCode workbench 위에서 동작.",
      "",
      "function hello(name: string) {",
      "  return `안녕 ${name}`;",
      "}",
      "",
      "console.log(hello('lightcode'));",
    ].join("\n"),
    language: "typescript",
    theme: "vs-dark",
    automaticLayout: true,
    minimap: { enabled: true },
    fontSize: 14,
  });
}

boot().catch((err) => {
  console.error(err);
  const splash = document.getElementById("splash");
  if (splash) splash.textContent = "초기화 실패 — DevTools 콘솔 확인.";
});
