---
type: llm
focus: trace
weight: 1
---

Detection is keyed on the root `$schema` value `https://json-schema.org/draft/2020-12/schema` and explicitly excludes documents with an `openapi` or `swagger` field. A root `$schema` with any other value (a custom meta-schema, an OAS dialect id, the http:// variant) is refused with a message, as already decided (decision 6), not rendered as 2020-12.
