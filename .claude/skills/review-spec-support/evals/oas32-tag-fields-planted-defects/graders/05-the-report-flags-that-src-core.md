---
type: llm
focus: trace
weight: 1
---

The report flags that src/core/components/operation-tag.jsx now renders the Tag `summary` for every OpenAPI version (3.0 and 3.1 Tag Objects have no `summary` field), with no test proving older versions are unaffected.
