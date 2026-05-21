import { defineConfig } from "vite";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";
import vsixPlugin from "@codingame/monaco-vscode-rollup-vsix-plugin";

// Hot reload via Vite, Tauri serves it in production.
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? { protocol: "ws", host, port: 1421 }
      : undefined,
    watch: { ignored: ["**/src-tauri/**"] },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [importMetaUrlPlugin],
    },
  },
  plugins: [
    vsixPlugin(),
    {
      // monaco-vscode-api ships large CSS files; inline so they bundle correctly.
      name: "load-vscode-css-as-string",
      enforce: "pre",
      async resolveId(source, importer, options) {
        const resolved = await this.resolve(source, importer, options);
        if (!resolved) return undefined;
        if (
          /node_modules\/(@codingame\/monaco-vscode|vscode|monaco-editor).*\.css$/.test(
            resolved.id
          )
        ) {
          return { ...resolved, id: resolved.id + "?inline" };
        }
        return undefined;
      },
    },
  ],
  build: {
    target: "esnext",
    sourcemap: false,
  },
});
