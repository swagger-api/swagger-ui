---
id: standalone
type: module-design
status: draft
title: Standalone preset — top bar and standalone layout
parent: architecture
depends-on:
  - core-runtime
  - document-lifecycle
  - ui-shell
---

## Responsibility

Provides the chrome for a full-page Swagger UI, as served by `swagger-ui-dist`, the `dist/`
folder, and the Docker image. It is shipped as its own bundle (`SwaggerUIStandalonePreset`) and
is **not** part of the core entry point. Users layer it on top of the apis preset and select
`layout: "StandaloneLayout"` (see `dist/swagger-initializer.js`).

The preset contains:

- **top-bar**: the URL input and the `urls` picker. It honours `urls.primaryName`, including from
  the query string, keeps the selection in the URL via `history.replaceState`, and loads the
  chosen definition through `specActions.updateUrl`/`download`. It also hosts the dark-mode
  toggle.
- **stadalone-layout** (directory name misspelled; import paths depend on it):
  `StandaloneLayout`, which wraps the core `BaseLayout` with skip-to-operations, the top bar,
  and the online validator badge.
- configs, plus a `SafeRender` instance (`fullOverride`) that covers `Topbar`,
  `StandaloneLayout`, and `onlineValidatorBadge`.

## Contracts

- **Dark mode is driven only from here.** The toggle sets `html.dark-mode` from
  `prefers-color-scheme` or a click. The dark-mode styles ship in the core CSS
  (`src/style/_dark-mode.scss`, outside the `.swagger-ui` scope), so embedders who don't use
  this preset get dark mode only if they set that class themselves.
