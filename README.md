# lightcode-v2

Lightweight VSCode-compatible editor.

**v1 (`dlsdud9098/lightcode`)** was a VSCodium rebrand — VSCode minus
telemetry/branding/some built-in extensions, still on Electron, idle RAM
~1.3 GB (i.e. same as VSCode).

**v2 (this repo)** drops Electron. Built on:

- **Tauri 2** (Rust + OS webview, no bundled Chromium)
- **`@codingame/monaco-vscode-api`** — runs the real VS Code workbench TS,
  with selectable service overrides, in any host.
- **Open VSX** marketplace
- VSCode extensions as `.vsix` (loaded via Vite's `vsixPlugin`, or via an
  optional Node sidecar running VS Code's official extension-host server)

Target: **idle RAM ~250-400 MB** (mac/win/linux), VSCode `.vsix`
compatibility for ~80% of common extensions (LSP, themes, grammars).

## Status

Scaffolding. Smoke-test stage:

- [x] Vite + monaco-vscode-api workbench boot
- [x] Tauri 2 shell
- [ ] Open VSX gallery wiring
- [ ] Node sidecar for full extension host
- [ ] PTY-backed terminal (Rust)
- [ ] File-tree explorer using Tauri fs

## Develop

```bash
npm install              # ~5-10 min, lots of vscode deps
npm run tauri dev        # first Rust compile ~5 min, then hot
```

## Layout

```
lightcode-v2/
├── src/                  # Vite frontend (monaco-vscode-api setup)
│   ├── workerSetupEntry.ts   # process.env shim — must import first
│   └── main.ts               # initialize() + monaco.editor.create()
├── src-tauri/            # Rust shell
│   ├── src/{main,lib}.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/default.json
├── index.html
├── vite.config.ts        # vsix plugin + import.meta.url plugin
└── package.json
```
