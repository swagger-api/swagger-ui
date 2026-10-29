---
type: llm
focus: trace
weight: 1
---

Array-form `items` (an array of schemas, positional/tuple validation) is flagged as rendering wrong with the current renderer because the 2020-12 `items` keyword takes a single schema (tuples moved to `prefixItems`).
