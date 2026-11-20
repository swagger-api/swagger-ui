---
id: react-flavor
type: module-design
status: draft
title: swagger-ui-react — React component flavor
parent: architecture
depends-on:
  - core-runtime
---

## Responsibility

Packages Swagger UI as a React function component (`index.jsx`, marked `"use client"`) for
React apps that already provide React. It is published as the npm package `swagger-ui-react`.

## Contracts

- **Props mirror options.** The props are a typed subset of the `SwaggerUI` options (`spec`,
  `url`, `layout`, interceptors, `onComplete`, `plugins`, `presets`, display and try-it-out
  flags, `initialState`, `uncaughtExceptionHandler`, …). Each prop defaults to
  `SwaggerUI.config.defaults`. `presets` is appended after the apis preset, never replacing it.
- **Lifecycle.** The component builds one `SwaggerUI` System on mount, with no `dom_id`, and
  renders `getComponent("App", "root")` itself, so React owns the DOM.
- **Re-exports.** The package re-exports `System`, `presets`, `plugins`, and `config` from
  core.
- **Packaging** (`release/run.sh`, `template.json`): the package bundles the built core and ES
  bundles and the CSS. It exposes `index.mjs`/`index.cjs` and `./swagger-ui.css`. `react` and
  `react-dom` are peer dependencies (`>=16.8 <20`), whereas the root `swagger-ui` package has
  them as regular dependencies.

## Known limitations

- **Only `url` and `spec` react to prop changes.** Every other prop is read once, on mount.
  Changing one later has no effect until the component remounts.
