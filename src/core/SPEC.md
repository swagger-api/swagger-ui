---
id: core-runtime
type: module-design
status: draft
title: Core runtime — System, config, presets, public API
parent: architecture
---

## Responsibility

Owns the machinery every feature plugs into: the **System** (`system.js`), the **config
pipeline** (`config/`), the **presets** (`presets/`), shared utilities (`utils/`), and the
`SwaggerUI(options)` entry point with its public statics (`index.js`). It holds no features
itself. Features arrive as plugins.

## The System contract

- **Plugin shape.** A plugin is an object, a `(system) => object` factory, or an array of
  either, nested to any depth. Its keys are `statePlugins[ns].{actions, reducers, selectors,
  wrapActions, wrapSelectors}`, `components`, `wrapComponents`, `fn`, `rootInjects`, and
  `afterLoad`.
- **Combination.** Plugins are deep-extended in order. A later key replaces an earlier one.
  Wrappers are collected into arrays and composed with the earliest innermost:
  `(ori, system) => …` for actions and components, and `(ori, system) => (nsState, …args)` for
  selectors.
- **Binding.** The bound system is rebuilt from scratch after each `register`. It exposes
  `${ns}Actions`, `${ns}Selectors`, a state accessor per namespace, `fn`, `configs`, and the root
  injects (`getSystem`, `getStore`, `getComponents`, `getState`, `getConfigs`, `Im`, `React`,
  plus each plugin's own). `getSystem()` always returns the *current* binding, so plugins must
  call it lazily.
- **Store.** A plain Redux store with Immutable root state, combined by a local Immutable
  `combineReducers`. A namespace reducer is a lookup by `action.type`. The thunk middleware
  calls function actions with `getSystem()`.
- **Error isolation.** Reducers, selectors, wrapped actions, and `afterLoad` run inside a
  try/catch that reports to `uncaughtExceptionHandler`. A throwing reducer leaves state
  unchanged, and a throwing action creator dispatches `NEW_THROWN_ERR`. Wrapped *selectors* are
  not isolated.
- `getComponent` and `render` are not provided here. They are root injects of the view plugin
  ([ui-shell](components/SPEC.md)).

## Config pipeline

- **Precedence**, lowest to highest: `defaults` < runtime-derived (`oauth2RedirectUrl` from
  `location`) < user options < query string. The query string is read only when the user sets
  `queryConfigEnabled`.
- **Remote config.** With `configUrl`, the fetched options merge above the user options and below
  the query string, and are applied after the System is built.
- **Merge and cast.** Every merge uses `deep-extend`, so an explicit `undefined` overrides, and
  is followed by type casting keyed by option path (`config/type-cast`).
- **Factorization.** `presets` become the System's base plugins. `layout`, `filter`, `url`,
  `requestSnippets`, and `initialState` seed initial state, and an `initialState` key set to
  `undefined` deletes that slice. `fn` and `components` become a final inline plugin.
- The user-facing option reference is `docs/usage/configuration.md`.

## Public API

`SwaggerUI.System`, `SwaggerUI.config.{defaults, merge, typeCast, typeCastMappings}`,
`SwaggerUI.presets.{base, apis}`, and `SwaggerUI.plugins.*` (one entry per core plugin). The
plugin-author contract is documented in `docs/customization/plugin-api.md` and
`plug-points.md`. Changes to this surface follow the backward-compatibility principle in the
[goal](../../goal-and-requirements.md).

## Boundary

- May import: `src/core/utils`, the presets' plugins (to assemble presets and exports), and
  `plugins/err/actions` (`NEW_THROWN_ERR`).
- Must not depend on any plugin's runtime behaviour beyond the error action.

## Known limitations

- **Export bugs in `index.js`:** `SwaggerUI.plugins.OpenAPI31` is the oas3 plugin, `OpenAPI32` is
  not exported, and the deep-linking key is misspelled `DeepLining`.
- **`configUrl` options arrive after the System is built.** They cannot change `presets`,
  `plugins`, `initialState`, `fn`, or `components`. If the fetch fails, the spec is not loaded.
- **`getConfigs()` during plugin load returns only `options.configs`.** The merged options are
  set just before render.
- **Factory plugins run twice per `register`.** `afterLoad` handling calls them again, which
  also forces a second System rebuild.
