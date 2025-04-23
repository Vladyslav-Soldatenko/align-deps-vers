# align-deps-vers

> 🛠️ A tiny CLI tool to align semver-declared dependency versions in `package.json` with what’s actually installed in `node_modules`.

[![npm version](https://img.shields.io/npm/v/align-deps-vers.svg)](https://www.npmjs.com/package/align-deps-vers)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## What it does

When dependencies are declared like:

```json
"chalk": "^5.0.0"
```

But `node_modules` contains a newer compatible version, say:

```json
"chalk": "5.3.0"
```

This tool updates your `package.json` to:

```json
"chalk": "^5.3.0"
```

➡️ Keeping your semver prefixes (`^`, `~`, etc.), while reflecting **actual versions**.

---

## 🚀 Usage

### Run instantly with `npx`

```bash
npx align-deps-vers
```

This:
- Reads your `package.json`
- Gets actual installed versions
- Rewrites all matching dependencies with updated (actual) versions

---


## How It Works

- Calls `npm list --json`
- Resolves top-level installed packages from `node_modules`
- Walks through:
  - `dependencies`
  - `devDependencies`
  - `optionalDependencies`
- If the declared version uses a prefix (`^`, `~`, etc.) — it replaces only the version part, not the prefix

---

## Example

Before:

```json
"dependencies": {
  "chalk": "^5.0.0",
  "ora": "~6.0.0"
}
```

Actually installed:

- `chalk@5.3.0`
- `ora@6.1.1`

After:

```json
"dependencies": {
  "chalk": "^5.3.0",
  "ora": "~6.1.1"
}
```

---

## Use Case

Useful for:
- Committing package updates with accurate dependency metadata
- Snapshotting versions for auditability and long-term tracking
- Improving visibility into the actual versions installed in `node_modules` (let's be honest, package-lock.json is not human-friendly)
- Avoiding confusion caused by mismatches between declared and real versions
