---
id: json-schema
type: module-design
status: draft
title: JSON Schema renderers and sample generators
parent: architecture
depends-on:
  - core-runtime
  - ui-shell
---

## Responsibility

Renders Schema Objects as expandable models and generates example payloads from them. There are
two independent renderer/sample pairs, chosen by OpenAPI version. A third, opt-in renderer,
[json-schema-unified](../json-schema-unified/SPEC.md), replaces the model views of both when
`unifiedJSONSchemaEnabled` is on; it reuses neither pair's code and leaves the samples to them.

| Pair | Plugins | Used for | Preset |
|---|---|---|---|
| Legacy | `json-schema-5`, `json-schema-5-samples` | OAS 2.0 and 3.0 schemas | base |
| Modern | `json-schema-2020-12` (this directory), `json-schema-2020-12-samples` | OAS 3.1 and 3.2 schemas | apis |

- **json-schema-5**: the `Model`/`ModelCollapse`/`Models` family, `fn.hasSchemaType`, and
  `getSchemaObjectTypeLabel`.
- **json-schema-2020-12**: one component per 2020-12 keyword (`components/keywords`), composed by
  the `JSONSchema` component. It is configured through a context and HOC
  (`withJSONSchemaContext`, plus `withJSONSchema202012SystemContext` for System-aware use), so a
  consumer can supply its own components, config (`default$schema`, expansion depth), and `fn`
  overrides without importing the plugin. Its helpers live under `fn.jsonSchema202012`.
- **Samples**: build JSON, YAML, XML, and form examples from a schema.
  - The legacy samples register both top-level `fn`s (`sampleFromSchema`, `getSampleSchema`, …)
    and the same set under `fn.jsonSchema5`.
  - The 2020-12 samples register only under `fn.jsonSchema202012`, with extension registries
    for formats, encoders, media types, and options (`sampleFormatAPI`, `sampleEncoderAPI`,
    `sampleMediaTypeAPI`, `sampleOptionAPI`).

## Contracts

- **Callers use the top-level `fn`s** (`fn.getSampleSchema`, `fn.hasSchemaType`, …): parameter
  rows, request and response bodies. For 3.1+ documents the version plugins switch those `fn`s
  to the 2020-12 implementations at call time ([oas-versions](../oas3/SPEC.md)). So which pair
  runs follows the document's version, not the caller.
- **The renderer is OpenAPI-agnostic.** OAS-specific keywords (discriminator, xml, externalDocs,
  example) and keyword overrides (Description, Examples, Properties) are added by the version
  plugins through `wrapComponents` and the HOC's `fn`/component overrides. They do not live
  here.
- A schema's `$schema` is displayed as a keyword. The configured `default$schema` does not yet
  change rendering, because nothing reads it.
- Standalone JSON Schema documents (a root with `$schema` and no `openapi`/`swagger`) are not
  detected or rendered today. The planned approach and its design decisions are owned by
  `.claude/skills/add-json-schema-support`. How the two renderers are built and coupled to
  OpenAPI is described in that skill's `references/renderer-architecture.md`.
