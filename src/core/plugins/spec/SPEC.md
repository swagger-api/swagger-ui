---
id: document-lifecycle
type: module-design
status: draft
title: Document lifecycle and request execution
parent: architecture
depends-on: [core-runtime, oas-versions]
---

## Responsibility

Takes a definition from its source to resolved, queryable state, and turns user input into
executed HTTP requests. This module is a group of base-preset plugins that share one job:

- **spec** (this directory): owns the `spec` state slice. That covers the raw string, parsed
  JSON, lazily resolved subtrees, parameter values and validation, requests and responses, and
  the `execute`/`executeRequest` actions and the selectors every renderer reads.
- **swagger-client**: the only bridge to the `swagger-client` library. It supplies `fn.fetch`
  (wired to the `preFetch`/`postFetch` configs), `buildRequest`, `execute`, `resolve`,
  `resolveSubtree`, `serializeRes`, and `opId`. It holds no state.
- **download-url**: `specActions.download(url)`, which fetches a definition and reports
  CORS/mixed-content hints on failure.
- **err**: the `err` slice for thrown, parse, and auth errors, normalised by its error
  transformers.
- **configs**: the runtime `configs` slice. Its `configsActions.loaded()` is the hook that other
  plugins wrap to run once configuration is final (swagger-client, auth, deep-linking).
- **on-complete**: calls the user's `onComplete` once, after the first spec update.
- **request-snippets**: the curl snippet generators (`fn.requestSnippetGenerator_*`) and the
  `RequestSnippets` component.
- **logs**, **versions**, **util**: the `log` root inject gated by `logLevel`, build info on
  `window.versions`, and `fn.sanitizeUrl`/`fn.shallowEqualKeys`.

## Flow

1. `updateSpec(string)` is wrapped to `parseToJson`. YAML/JSON parse errors go to `err`.
2. `updateJsonSpec(json)` is wrapped to invalidate the resolved-subtree cache and eagerly
   resolve path-item and `components.securitySchemes` `$ref`s.
3. Everything else resolves **lazily**: a renderer calls `requestResolvedSubtree(path)` when it
   needs a subtree, and reads it through `specJsonWithResolvedSubtrees`. Code that needs
   `$ref`-resolved data must read from that selector, not from `specJson`.
4. `execute` builds a request from the stored parameter and body values (plus auth, which
   [auth](../auth/SPEC.md) injects by wrapping `execute`), runs `requestInterceptor`, sends it
   through `fn.execute`, runs `responseInterceptor`, and stores the response.

## Contracts

- Resolution order for `resolveSubtree` is the OAS 3.2 → 3.1 → 3.0 → 2.0 → generic
  swagger-client strategies. A new OpenAPI version adds its strategy first, in both `resolve`
  and `resolveSubtree`.
- `isOAS3` in this plugin is a stub that returns `false`. Real version detection belongs to
  [oas-versions](../oas3/SPEC.md), which this module calls through `oas3Selectors` (selected
  server, server variables, request body) without a guard. This is the base-preset coupling
  recorded in [architecture](../../../../architecture.md).

## Known limitations

- `fn.resolve` lacks the OAS 3.2 strategy, though `resolveSubtree` has it. `fn.resolve` is used
  only by the deprecated `specActions.resolveSpec` and by third-party plugins.
- `specActions.resolveSpec` is deprecated in favour of `requestResolvedSubtree`.
