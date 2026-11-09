---
id: oas-versions
type: module-design
status: draft
title: OpenAPI version plugins — oas3, oas31, oas32
parent: architecture
depends-on:
  - core-runtime
  - document-lifecycle
  - ui-shell
  - json-schema
---

## Responsibility

Detects which OpenAPI version a document is and supplies everything specific to OAS 3.x. There
is one plugin per minor line, stacked in the apis preset as oas3 → oas31 → oas32. This directory
(oas3) is the base of the stack.

- **oas3** (3.0): the `isOAS30`, `isOAS3`, and `isSwagger2` selectors; servers and server
  variables; requestBody; callbacks; HTTP auth and OAuth2 `flows`; and the `oas3` state slice.
  For 3.x documents it nulls the 2.0-only spec selectors (`host`, `basePath`, `schemes`,
  `consumes`, `produces`) and maps `definitions`/`securityDefinitions` onto `components`.
- **oas31** (3.1): `isOAS31`; webhooks; `jsonSchemaDialect`; `mutualTLS`; Info, License, and
  Contact with `summary`/`identifier`. It renders models through the 2020-12 renderer, adding
  OAS keywords (discriminator, xml, externalDocs, example).
- **oas32** (3.2): `isOAS32`; the QUERY method and `additionalOperations`; and its own badge,
  pragma filter, and model wrappers.

OAS 2.0 has no plugin of its own. It renders through the shared components
([ui-shell](../../components/SPEC.md)) and the JSON Schema 5 renderer.

## Version gating

- Detection is by regex on the root field: `swagger: "2.0"`, or `openapi: 3.0.n`, `3.1.n`, or
  `3.2.n` (any patch number without a leading zero). A document that has both `swagger` and
  `openapi` is ambiguous. Unsupported and ambiguous documents go to `VersionPragmaFilter`.
- `isOAS3` is **widened on purpose**. oas31 and oas32 wrap it to also be true for their own
  versions, so 3.1 and 3.2 documents inherit the 3.0 features (servers, requestBody, callbacks).
- Every other behaviour is gated on its own version. Each plugin carries its own helpers in
  `fn.js` (`createOnlyOAS3xSelector`, `createOnlyOAS3xSelectorWrapper`,
  `createOnlyOAS3xComponentWrapper`, `wrapOAS3xFn`). A wrapper falls through to the original
  when its version is not detected.
- **Invariant: a newer version plugin never changes how an older version renders.** A change to
  shared or core code for a new version is gated at the call site and comes with a test showing
  older versions are unchanged.
- **The newest plugin loads last among the OpenAPI plugins**, before json-schema-unified (load
  order: [architecture](../../../../architecture.md)). `VersionPragmaFilter` and other last-wins
  overrides belong to it. `afterLoad` uses `wrapOAS3xFn` to switch the top-level sample and schema `fn`s
  (`sampleFromSchema`, `getSampleSchema`, `hasSchemaType`, …) to the 2020-12 versions for 3.1+
  documents ([json-schema](../json-schema-2020-12/SPEC.md)).

## Self-containment

- Version plugins do not import from each other. Shared behaviour is copied into each plugin,
  and **a bug fixed in one copy is fixed in every copy**.
- At runtime oas32 still builds on oas31: it reuses oas31's registered components through
  `getComponent("OAS31…")` and relies on oas31's `afterLoad` having set
  `fn.jsonSchema202012.isExpandable`/`getProperties`. That overwrite is not version-gated.
- oas3 has one import exception (`spec-extensions/wrap-selectors.js → spec/selectors`), listed in
  [architecture](../../../../architecture.md).

## Adding a version or a field

Integration points for a new version: the swagger-client resolve strategy in both `resolve` and
`resolveSubtree`, the last OpenAPI position in the apis preset (before json-schema-unified), an entry in `SwaggerUI.plugins`, and the
`isOAS3Y` flag in `BaseLayout`. The delivery process is: investigation, then a parity-only
basic-support PR, then one PR per new feature or breaking change, each reviewed against the
specification. That process is owned by the `.claude/skills/add-oas-support` and
`review-spec-support` skills, which this spec does not restate.

## Known limitations

- **OAS 3.2 parity gaps:**
  - no `mutualTLS` (oas31's auth wrappers are gated on `isOAS31` only);
  - `fn.resolve` lacks the 3.2 strategy ([document-lifecycle](../spec/SPEC.md));
  - oas32's `default$schema` is the OAS 3.2 *document* schema, not a Schema Object dialect.
    Nothing reads it yet, and which dialect id to use is an open decision.
- **OAS 3.2 fields not yet implemented:** `$self`, `mediaTypes`, the Tag enhancements,
  `querystring`, and `itemSchema`.
- `SwaggerUI.plugins.OpenAPI31`/`OpenAPI32` exports are wrong or missing
  ([core-runtime](../../SPEC.md)).
- The core `VersionPragmaFilter` message mentions only 3.0.n. In the apis preset the oas32
  override hides this.
- **The `Model`/`Models` wrappers of oas31 and oas32 cache their 2020-12 instance on a static
  field keyed by `location.pathname`.** The first render's `includeReadOnly`/`includeWriteOnly`,
  expand depth, and System are frozen, so a response Schema tab opened after a request one can
  hide the wrong properties. This is inferred from the code and not yet reproduced (unconfirmed).
  A separate fix is pending. [json-schema-unified](../json-schema-unified/SPEC.md)
  avoids this pattern.
