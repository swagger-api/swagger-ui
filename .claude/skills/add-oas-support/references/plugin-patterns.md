# Version Plugin Patterns

Every template below is copied from the oas32 plugin on `main`, and the source file is named
above it. Diff the template against that file before reusing it, because the file may have
moved on. Replace `32` with the new version and `31` (the parent) with the new parent.

New files are TypeScript (`CLAUDE.md`): `.tsx` for anything containing JSX (including `fn.tsx`,
whose component-wrapper factory renders JSX), `.ts` otherwise. `tsconfig.json` has
`strict: false` and `allowJs`, so a `.ts` file can import the existing `.js` modules. Existing
TypeScript in `src/` to imitate: `src/core/utils/operation-methods.ts`,
`src/core/plugins/oas31/components/models/schema-item.tsx`.

## Contents

1. Plugin layout
2. Detection
3. Version-gated factories
4. Widening `isOAS3`
5. Version pragma filter
6. Wrap versus copy
7. JSON Schema 2020-12 renderer
8. after-load
9. Selectors
10. Operation methods

## 1. Plugin Layout

`src/core/plugins/oas32/` (index.js registers everything):

```
oas32/
├── index.js                      plugin object: fn, components, wrapComponents, statePlugins, afterLoad
├── fn.js                         isOAS32 + createOnlyOAS32* factories + wrapOAS32Fn
├── after-load.js                 fn routing through wrapOAS32Fn
├── selectors.js                  oas32 state-plugin selectors (validOperationMethods)
├── components/version-pragma-filter.jsx
├── wrap-components/              contact, info, license, model, models, openapi-version, version-pragma-filter
├── spec-extensions/selectors.js  selectIsOAS32 and field selectors
├── spec-extensions/wrap-selectors.js  isOAS3, validOperationMethods, callbacks/webhooks operations
├── oas3-extensions/fn.js         makeIsFileUploadIntended (own copy, no import from oas31)
└── json-schema-2020-12-extensions/
    ├── fn.js                     makeGetSchemaKeywords
    ├── components/keywords/      Description, Properties (own copies)
    └── wrap-components/keywords/ Description, Examples, Properties
```

The registration shape is `src/core/plugins/oas32/index.js`: `fn` exposes `isOAS32`,
`createSystemSelector` and `createOnlyOAS32Selector`; detection is
`statePlugins.spec.selectors.isOAS32: createSystemSelector(selectIsOAS32)`; wrappers go under
`wrapComponents` and `statePlugins.spec.wrapSelectors`. Keep the plugin header comment honest:
it lists what is implemented and what is deferred, and reviewers read it (it still calls
`info.summary` new in 3.2, which it isn't).

## 2. Detection

`src/core/plugins/oas32/fn.js`:

```js
export const isOAS32 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")

  return (
    typeof oasVersion === "string" && /^3\.2\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}
```

`src/core/plugins/oas32/spec-extensions/selectors.js`:

```js
export const selectIsOAS32 = (state, system) => () => {
  const spec = system.specSelectors.specJson()
  return isOAS32(spec)
}
```

The regex accepts every patch (`3.2.0`, `3.2.25`) and rejects `3.2`, `3.2.01` and other lines;
`test/unit/core/plugins/oas32/fn.js` tests exactly those cases.

## 3. Version-Gated Factories

All in `src/core/plugins/oas32/fn.js`. Use them instead of writing `if (isOAS32())` by hand
(`HAND-GUARD` in `check-plugin-conventions.mjs`).

| Factory | Wraps | When not 3.2 |
|---------|-------|--------------|
| `createOnlyOAS32Selector(selector)` | a new selector | returns `null` |
| `createOnlyOAS32SelectorWrapper(selector)` | an existing selector (`wrapSelectors`); `selector(state, ...args)` may return `(oriSelector, system) => value` | calls the original |
| `createOnlyOAS32ComponentWrapper(Component)` | an existing component (`wrapComponents`); `Component` gets the props plus `originalComponent` and `getSystem` | renders `<Original {...props} />` |
| `wrapOAS32Fn({ name: impl }, system)` | system `fn` entries (in after-load) | calls the original `fn[name]` |
| `createSystemSelector(selector)` | a selector needing `system` as second argument | - |

The original component arrives as the `originalComponent` prop: write
`const { originalComponent: Ori } = props`. A prop named `Ori` belongs to the oas3 plugin's
`OAS30ComponentWrapFactory`, which has a different signature.

```js
// src/core/plugins/oas32/fn.js
export const createOnlyOAS32ComponentWrapper =
  (Component) => (Original, system) => (props) => {
    if (system.specSelectors.isOAS32()) {
      return (
        <Component
          {...props}
          originalComponent={Original}
          getSystem={system.getSystem}
        />
      )
    }

    return <Original {...props} />
  }
```

## 4. Widening `isOAS3`

`isOAS3` (oas3 plugin) means "3.0.x" until a later plugin widens it, and OAS 3 rendering
depends on it: `servers` and `callbacksOperations` are `onlyOAS3` selectors
(`src/core/plugins/oas3/spec-extensions/selectors.js`), request bodies in `parameters/parameters.jsx`,
response content in `responses.jsx`/`response.jsx`, OAuth2 flows in `auth/oauth2.jsx`. Each later plugin
widens it with a plain wrap-selector, `src/core/plugins/oas32/spec-extensions/wrap-selectors.js`:

```js
export const isOAS3 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS32 = system.specSelectors.isOAS32()
    return isOAS32 || oriSelector(...args)
  }
```

This wrapper and the version pragma filter wrapper are the only places that read `isOAS3Y()`
directly; `check-plugin-conventions.mjs` exempts them. Don't add an `isOAS3{P}` wrapper for the
parent: the parent's regex already rejects the new line, so it never runs.

## 5. Version Pragma Filter

Three pieces, all needed:

- `src/core/plugins/oas32/components/version-pragma-filter.jsx`: copy of the parent's filter with
  an `isOAS32` prop added to the PropTypes, both conditions, and the supported-versions text.
- `src/core/plugins/oas32/wrap-components/version-pragma-filter.jsx`: renders the plugin's filter
  with the detection result.
  ```js
  const VersionPragmaFilterWrapper = (Original, system) => (props) => {
    const isOAS32 = system.specSelectors.isOAS32()
    const OAS32VersionPragmaFilter = system.getComponent("OAS32VersionPragmaFilter")
    return <OAS32VersionPragmaFilter isOAS32={isOAS32} {...props} />
  }
  ```
- `src/core/components/layouts/base.jsx`: reads `specSelectors.isOAS32()` and passes
  `isOAS32={isOAS32}` to `VersionPragmaFilter`; the `(isOAS31 || isOAS32)` condition there
  decides whether webhooks render. Without the prop the filter shows "Unable to render this
  definition" for every 3.Y document.

## 6. Wrap Versus Copy

Default to **wrapping** and reusing the parent's components at runtime through the system.
`getComponent`, `fn` and selectors are not imports, so they don't break plugin independence
(`CLAUDE.md`, "Cross-Plugin Import Guidelines").

`src/core/plugins/oas32/wrap-components/info.jsx`, which replaced a copied `Info` component
during the #10721 review:

```js
const InfoWrapper = createOnlyOAS32ComponentWrapper(({ getSystem }) => {
  const system = getSystem()
  const OAS31Info = system.getComponent("OAS31Info", true)

  return <OAS31Info />
})
```

`src/core/plugins/oas32/wrap-components/openapi-version.jsx` (badge only):

```js
export default createOnlyOAS32ComponentWrapper((props) => {
  const { originalComponent: Ori } = props
  return <Ori oasVersion="3.2" />
})
```

**Copy** only when the code must differ for the new version, and copy it into the new plugin's
own directory (no `import` from another plugin; `CROSS-IMPORT`). The copies in oas32 are
`oas3-extensions/fn.js` and `json-schema-2020-12-extensions/components/keywords/*`. A copied bug
must be fixed in every copy.

| Situation | Do |
|-----------|----|
| Parent component renders 3.Y correctly | wrapper that renders `getComponent("OAS3{P}X", true)` |
| Only a prop differs (version badge) | wrapper around `originalComponent` with the new prop |
| A new field must render inside a parent component | copy that component into the plugin, add the field, wrap the original name |
| Behaviour differs in a system fn | `wrapOAS3YFn` in after-load |
| Shared core code must change | change it once, gated at the call site, with an older-version test |

## 7. JSON Schema 2020-12 Renderer

The parent's `Model`/`Models` wrappers are gated on the parent version, so a new plugin must wire
the renderer for itself (fixed late during #10721). `src/core/plugins/oas32/wrap-components/model.jsx`:

```js
const ModelWrapper = createOnlyOAS32ComponentWrapper(
  ({ getSystem, ...props }) => {
    const system = getSystem()
    const { getComponent, fn, getConfigs } = system
    const configs = getConfigs()

    const pathname = window?.location?.pathname ?? "/"

    if (
      ModelWrapper.ModelWithJSONSchemaContext &&
      ModelWrapper.pathname === pathname
    ) {
      return <ModelWrapper.ModelWithJSONSchemaContext {...props} />
    }

    const Model = getComponent("OAS31Model")
    const withJSONSchemaSystemContext = getComponent(
      "withJSONSchema202012SystemContext"
    )

    // we cache the HOC as recreating it with every re-render is quite expensive
    ModelWrapper.ModelWithJSONSchemaContext = withJSONSchemaSystemContext(
      Model,
      {
        config: {
          default$schema: "<Schema Object dialect id, see below>",
          defaultExpandedLevels: configs.defaultModelExpandDepth,
          includeReadOnly: props.includeReadOnly,
          includeWriteOnly: props.includeWriteOnly,
        },
        fn: {
          getProperties: fn.jsonSchema202012.getProperties,
          isExpandable: fn.jsonSchema202012.isExpandable,
          getSchemaKeywords: makeGetSchemaKeywords(
            fn.jsonSchema202012.getSchemaKeywords
          ),
        },
      }
    )
    ModelWrapper.pathname = pathname

    return <ModelWrapper.ModelWithJSONSchemaContext {...props} />
  }
)
```

`wrap-components/models.jsx` is the same with `OAS31Models`, `defaultModelsExpandDepth - 1` and
`includeReadOnly`/`includeWriteOnly: true`. The cache is invalidated on `pathname` (#10764).

`default$schema` is the **Schema Object dialect** id, not the OAS document schema. oas31 uses
`https://spec.openapis.org/oas/3.1/dialect/base`. oas32 on `main` uses the 3.2 *document*
schema (`/oas/3.2/schema/...`), which `check-plugin-conventions.mjs` reports as `DIALECT`.
Nothing reads `default$schema` today (`grep -rn 'default\$schema' src` finds only the
assignments), so the wrong value has no visible effect yet. Get it right anyway: standalone JSON
Schema rendering will select behaviour from it.

OAS-specific keywords: `src/core/plugins/oas32/json-schema-2020-12-extensions/fn.js` adds
`discriminator`, `xml`, `externalDocs`, `example` and the internal `$$ref` to the 2020-12 keyword
list, so they don't land in "Extension Keywords". The plugin also wraps
`JSONSchema202012KeywordDescription` (markdown), `...Examples` and `...Properties`.

## 8. after-load

`src/core/plugins/oas32/after-load.js` routes system fns to the 2020-12 implementations when the
document is 3.2:

```js
function afterLoad({ fn, getSystem }) {
  if (typeof fn.sampleFromSchema === "function" && fn.jsonSchema202012) {
    const wrappedFns = wrapOAS32Fn(
      {
        sampleFromSchema: fn.jsonSchema202012.sampleFromSchema,
        // ...sampleFromSchemaGeneric, createXMLExample, memoized*, get*SampleSchema,
        // getSampleSchema, mergeJsonSchema, getSchemaObjectTypeLabel, getSchemaObjectType
      },
      getSystem()
    )
    Object.assign(this.fn, wrappedFns)
  }

  const isFileUploadIntended = makeIsFileUploadIntended(getSystem)
  const { isFileUploadIntended: isFileUploadIntendedWrap } = wrapOAS32Fn(
    { isFileUploadIntended },
    getSystem()
  )
  this.fn.isFileUploadIntended = isFileUploadIntendedWrap
  this.fn.isFileUploadIntendedOAS32 = isFileUploadIntended

  if (fn.jsonSchema202012) {
    const { hasSchemaType } = wrapOAS32Fn(
      { hasSchemaType: fn.jsonSchema202012.hasSchemaType },
      getSystem()
    )
    this.fn.hasSchemaType = hasSchemaType
  }
}
```

Because each plugin wraps the previous `this.fn` entry, the chain falls through to the right
version. Note `src/core/plugins/oas31/after-load.js` also *replaces*
`fn.jsonSchema202012.isExpandable` and `getProperties` without a version check; that override
applies to every document, including 3.Y ones.

## 9. Selectors

- Every export of a selectors file passed to `statePlugins.*.selectors` becomes a public
  selector. Keep helpers unexported or in another module, and don't add selectors that only tests
  call.
- Memoize derived collections with `createSelector` (`spec-extensions/wrap-selectors.js`:
  `selectValidOperationMethods`, `selectWebhooksOperationsFromMap`).
- Guard Immutable values with `Map.isMap` / `List.isList` and fall back to an empty constant
  (`spec-extensions/selectors.js`: `license`).
- Read anything that may be behind a `$ref` from `specJsonWithResolvedSubtrees()`.

## 10. Operation Methods

The fixed Path Item operation fields live once in `src/core/utils/operation-methods.ts`
(`OPERATION_METHODS`, `isOperationMethodField`, `isFixedOperationMethod`): the core `operations`
selector collects every method in that list. What renders is decided by `validOperationMethods`:
the core selector (`src/core/plugins/spec/selectors.js`) keeps its base list, and the version plugin extends it
through `createOnlyOAS32SelectorWrapper` (`spec-extensions/wrap-selectors.js`) and keeps its own
list in `src/core/plugins/oas32/selectors.js`. Adding a method to the core list instead makes
older versions render it (#10721 review). Try-it-out also needs the method in
`supportedSubmitMethods` (`src/core/config/defaults.js`, documented in
`docs/usage/configuration.md`, passed through `flavors/swagger-ui-react/index.jsx`).
