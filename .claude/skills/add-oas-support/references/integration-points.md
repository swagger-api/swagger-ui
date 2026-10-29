# Integration Points

Files outside `src/core/plugins/oas3Y/` that a new version or a feature touches. The list comes
from the diffs of #10721 (`git show --stat 4675ad74`) and #11090 (`git show --stat 2f91b75b`)
plus the fixes that came later. When a feature touches a file that isn't listed, add it here.

## Basic Support (PR 1)

| File | Change | What happens without it |
|------|--------|-------------------------|
| `package.json` | `swagger-client` at the first release that ships `es/resolver/strategies/openapi-3-Y-apidom` (#11090 bumped `^3.38.3` → `^3.38.4` for 3.2) | the strategy import fails to resolve |
| `src/core/plugins/swagger-client/index.js` | import `openApi3YApiDOMResolveStrategy` and list it first in `resolveSubtree`'s `strategies` (what the UI uses) and in `resolve`'s (used by the deprecated `specActions.resolveSpec` and by plugins calling `system.fn.resolve`; oas31's strategy is there too) | `$ref` siblings dropped, 3.Y documents resolved by the generic strategy (#11090) |
| `src/core/presets/apis/index.js` | import `OpenAPI3YPlugin`, append it **last** | parent plugin's wrappers win; `PRESET-ORDER` |
| `src/core/index.js` | import `OpenAPI3YPlugin from "./plugins/oas3Y"`, add `OpenAPI3Y: OpenAPI3YPlugin` to `SwaggerUI.plugins` | users composing their own preset can't reach the plugin; `EXPORT` |
| `src/core/components/layouts/base.jsx` | `const isOAS3Y = specSelectors.isOAS3Y()`, pass `isOAS3Y={isOAS3Y}` to `VersionPragmaFilter`, add it to the webhooks condition `(isOAS31 \|\| isOAS32)` | "Unable to render this definition"; no webhooks section |
| parent's `components/version-pragma-filter.jsx` | supported-versions text no longer says "3.x.y" (#10721 changed the oas31 copy) | message lists the wrong versions |
| `README.md` | row in the Compatibility table (`TBD` release date until the release) | users can't tell the version is supported |
| `CLAUDE.md` | plugin list and "OpenAPI Specification Compatibility" | AI assistants work from stale facts |

On `main` today, `src/core/index.js` imports `OpenAPI31Plugin from "./plugins/oas3"` (the 3.0
plugin) and has no `OpenAPI32` entry, and `resolve` doesn't list the 3.2 strategy. Don't copy
those lines as templates; they're in `../../FOLLOW-UPS.md`.

## Feature PRs

| When the feature... | Files | Example |
|---------------------|-------|---------|
| adds an HTTP method | `src/core/utils/operation-methods.ts` (`OPERATION_METHODS`), the plugin's `validOperationMethods` list and wrapper, `src/core/config/defaults.js` `supportedSubmitMethods`, `docs/usage/configuration.md`, colour in `src/style/_variables.scss` (`$color-{method}`), `src/style/_layout.scss` (`.opblock-{method}`), `src/style/_dark-mode.scss` | QUERY, #10721 |
| adds operations outside the fixed fields | `src/core/plugins/spec/selectors.js` (`operations`), `src/core/plugins/spec/reducers.js`, `src/core/plugins/oas3/selectors.js` (callbacks), `src/core/components/operation.jsx`, `operation-summary.jsx`, `operation-summary-method.jsx`, `overview.jsx` | additionalOperations, #11090 |
| changes request building | swagger-client release first; Swagger UI only passes data through | - |
| adds a config option | `src/core/config/defaults.js`, `docs/usage/configuration.md`, `flavors/swagger-ui-react/index.jsx` (destructured prop, constructor call, `propTypes`) | `supportedSubmitMethods` gained `query` |
| renders inside an existing component | copy the component into the plugin and wrap the original name (`plugin-patterns.md` section 6); touch `src/core/components/` only when the change must reach every version | - |
| adds a Schema Object keyword | the plugin's `json-schema-2020-12-extensions` (`makeGetSchemaKeywords` plus a keyword component and wrapper) | `discriminator`, `xml` |
| needs a new style | `src/style/*.scss` and the dark-mode counterpart; hex colours lowercase | `$color-query` |

`flavors/swagger-ui-react` needs no change for a new plugin, preset or layout: `presets` always
prepends `apis`, and `layout` is already a prop. It only changes for new config options.

## Data Sources

- `specJson()`: the document as loaded; `$ref`s unresolved.
- `specJsonWithResolvedSubtrees()`: what the user has expanded so far, with `$ref`s resolved.
  Anything that may sit behind a `$ref` (a `requestBody`, a Path Item, a Media Type) must be
  read from here: #11090 switched the oas3 `requestBody.required` lookup from `specJson()` to it.
- `specResolvedSubtree(path)`: a single resolved subtree.
- `operationSpecPath(path, method)` (`src/core/plugins/spec/selectors.js`): the spec path of an
  operation. Use it instead of `["paths", path, method]`, which is wrong for operations that
  don't live under a fixed method field (additionalOperations, #11090).

## Proving Older Versions Are Unaffected

Each shared file above needs a test that loads a parent-version document (and a 3.0 one when the
change is in `oas3` or core) and asserts the old behaviour: a method that must not render, a
field that must be ignored, an operation list that must stay the same. `CORE-TOUCH` in
`check-plugin-conventions.mjs` lists the files that need such a test.
