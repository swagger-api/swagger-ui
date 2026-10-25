# Renderer Architecture

How the two JSON Schema renderers are built, where they are coupled to OpenAPI, and what a
standalone document or a new draft needs from them. Line numbers are from `main` on 2026-10-22;
re-check them before citing.

## Contents

1. The 2020-12 renderer
2. Adding or changing a keyword
3. Unknown keywords
4. Where OpenAPI is coupled in
5. The legacy renderer
6. Gaps for standalone documents
7. Exports

## 1. The 2020-12 Renderer

`src/core/plugins/json-schema-2020-12/`:

| Piece | File | Role |
|-------|------|------|
| Plugin | `index.js` | registers `JSONSchema202012` and one `JSONSchema202012Keyword{Name}` component per keyword, the HOCs, and `fn.jsonSchema202012.*` |
| Root component | `components/JSONSchema/JSONSchema.jsx` | renders one schema: pulls every keyword component through `useComponent("Keyword...")` (lines 47-92) and places them in a fixed order (from line 136) |
| Keyword components | `components/keywords/*` | one per keyword or keyword group; `Constraint` renders validation keywords as chips |
| Helpers | `fn.js` | `getSchemaKeywords()` (line 423, the list of known keywords, grouped by 2020-12 vocabulary), `makeGetExtensionKeywords` (line 497), `stringifyConstraints` (line 311), `getTitle`, `getType`, `isExpandable` |
| Context | `context.js`, `hooks.js` | `useFn`, `useConfig`, `useComponent`, `useLevel`, `usePath`, `useIsExpanded` |
| HOCs | `hoc.jsx` | `withJSONSchemaContext(Component, overrides)` and `makeWithJSONSchemaSystemContext({ getSystem })`, registered as `withJSONSchema202012Context` and `withJSONSchema202012SystemContext` |

A renderer instance is a component wrapped in one of the HOCs, and the HOC's `overrides`
(`components`, `config`, `fn`) configure that instance only:

- `withJSONSchemaContext` uses the plugin's own components and defaults: `config.default$schema`
  `https://json-schema.org/draft/2020-12/schema`, `defaultExpandedLevels: 0`,
  `showExtensionKeywords: true`, and `fn` built from `fn.js` with `useFn` (`hoc.jsx` around
  lines 115-145).
- `withJSONSchema202012SystemContext` takes the components from the system (so OAS plugins'
  wrappers apply) and sets `config.showExtensionKeywords: configs.showExtensions` (line 289,
  default `false` in `src/core/config/defaults.js:34`). `fn` is only what `overrides.fn` passes;
  the rest falls back to the `withJSONSchemaContext` defaults.

This per-instance configuration is the mechanism for dialects: a standalone document renderer
can pass its own `getSchemaKeywords`, components and config without changing how OAS documents
render. `src/core/plugins/oas32/wrap-components/model.jsx` is the working example of an instance
configured with overrides.

## 2. Adding or Changing a Keyword

There is no keyword registry. A keyword the renderer should know needs:

1. a component in `components/keywords/{Name}.jsx` (new files: `.tsx`), reading its value from
   the `schema` prop;
2. registration in `index.js` as `JSONSchema202012Keyword{Name}`;
3. an entry in both component lists of `hoc.jsx` (`withJSONSchemaContext` and
   `makeWithJSONSchemaSystemContext`);
4. a `useComponent("Keyword{Name}")` and a place in `JSONSchema.jsx`, next to the keywords of
   its vocabulary;
5. the name in the keyword list the instance uses (`getSchemaKeywords` or a dialect-specific
   list passed through `overrides.fn`), so that it isn't also shown as an extension keyword;
6. a constraint chip instead, when the keyword is a validation keyword with a simple value
   (`stringifyConstraints` in `fn.js`);
7. sample generation in `json-schema-2020-12-samples` when the keyword affects example values.

A keyword that exists in 2020-12 but has a different value shape or meaning in the target draft
must not reuse the 2020-12 component unchanged: every component assumes the 2020-12 shape.
Give the dialect instance its own component through `overrides.components`.

Keywords that only one dialect has belong to that dialect's instance (overrides), not to
`getSchemaKeywords()`, which is the 2020-12 list and is also what OAS 3.1/3.2 extend.

## 3. Unknown Keywords

`makeGetExtensionKeywords` returns every key of a schema that isn't in the instance's
`getSchemaKeywords()`, and `ExtensionKeywords` renders them as raw JSON, but only when
`showExtensionKeywords` is true. Through the system HOC that is `configs.showExtensions`,
`false` by default, so unknown keywords are **hidden** by default. "Supporting arbitrary
keywords" therefore means deciding how each keyword renders, not adding a catch-all: the
catch-all exists already.

## 4. Where OpenAPI Is Coupled In

All in the OAS plugins, so a standalone document (no `openapi` field) doesn't trigger them. But
SwaggerEditor runs one Swagger UI system for every document type, so they are present:

- **Extra keywords**: `src/core/plugins/oas31/json-schema-2020-12-extensions/fn.js` and the
  oas32 copy add `discriminator`, `xml`, `externalDocs`, `example` and the internal `$$ref` to the
  keyword list.
- **Component wrappers**: oas31 and oas32 wrap `JSONSchema202012KeywordDescription` (markdown),
  `...Examples` and `...Properties` with `createOnlyOAS3xComponentWrapper`, so they fall
  through to the 2020-12 originals for non-OAS documents. oas31 also registers OAS-only keyword
  components (`JSONSchema202012KeywordExample`, `...Xml`, `...Discriminator`, `...ExternalDocs`).
- **after-load**: `src/core/plugins/oas31/after-load.js` replaces
  `fn.jsonSchema202012.isExpandable` and adds `fn.jsonSchema202012.getProperties` on the system,
  with no version check. They reach a renderer instance only when a wrapper passes them in
  `overrides.fn`, as the OAS `Model`/`Models` wrappers do. A standalone instance must not copy
  that `fn` block, or it inherits OAS behaviour.
- **Markdown descriptions**: JSON Schema defines `description` as plain text; the markdown
  rendering comes from the OAS wrappers, where OAS allows CommonMark. Plain text is the
  spec-correct default for a standalone document.

## 5. The Legacy Renderer

`src/core/plugins/json-schema-5/` renders OAS 2.0 and 3.0 schemas and is coupled to the OAS
document:

- it reads definitions through `specSelectors.findDefinition` and `specSelectors.definitions()`;
- `components/object-model.jsx:115-118` renders `allOf`/`anyOf`/`oneOf`/`not` only when
  `specSelectors.isOAS3()`;
- components expect `specPath` and the layout actions;
- it knows no keyword beyond its OAS subsets.

Using it for standalone Draft 4/6 documents would need real decoupling first, so decision 3
(`design-and-delivery.md`) renders every draft, Draft 4/5/6 included, with a 2020-12 instance
and per-dialect overrides. The legacy renderer stays with OAS 2.0 and 3.0.

## 6. Gaps for Standalone Documents

Independent of the draft:

- **Detection**: nothing in Swagger UI recognises a JSON Schema document. The OAS detectors all
  fail, and the oas32 version pragma filter shows "Unable to render this definition".
- **Entry point**: OAS schemas reach the renderer through `Model`/`Models`. A standalone
  document needs a component that renders the root schema with an instance configured for its
  dialect, and a layout branch that shows it instead of the OAS layout.
- **`$ref`**: `Keyword$ref` shows the reference as a string. In OAS documents swagger-client
  resolves references before rendering (`specJsonWithResolvedSubtrees`); for a standalone
  document, check which resolve strategy matches it (`src/core/plugins/swagger-client/index.js`
  lists them) and whether it understands `$id` base URIs and `$anchor`s.
- **Descriptions**: plain text (section 4).

## 7. Exports

`SwaggerUI.plugins` (`src/core/index.js`, around lines 145-175) exports `JSONSchema202012`,
`JSONSchema202012Samples`, `JSONSchema5` and `JSONSchema5Samples`. The `apis` preset
(`src/core/presets/apis/index.js`) includes `JSONSchema202012Plugin` and
`JSONSchema202012SamplesPlugin`. The `json-schema-document` plugin (decision 7) gets the same
two registrations, as `JSONSchemaDocument` and after `OpenAPI32Plugin` in the preset; joining
the `apis` preset is a public behaviour change for every Swagger UI user (decision 4).
