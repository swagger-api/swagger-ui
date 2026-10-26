---
type: llm
focus: trace
weight: 1
---

The plan identifies OpenAPI coupling that a standalone instance must avoid, naming at least one of: the oas31 after-load overrides of fn.jsonSchema202012 (isExpandable/getProperties), the OAS extra keywords (discriminator, xml, externalDocs, example, $$ref), or the OAS markdown Description wrapper.
