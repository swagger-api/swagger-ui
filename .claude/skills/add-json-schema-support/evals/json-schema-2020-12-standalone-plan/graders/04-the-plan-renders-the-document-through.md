---
type: llm
focus: trace
weight: 1
---

The plan renders the document through a renderer instance created with withJSONSchema202012Context or withJSONSchema202012SystemContext and per-instance overrides, rather than changing getSchemaKeywords() or the shared 2020-12 components globally.
