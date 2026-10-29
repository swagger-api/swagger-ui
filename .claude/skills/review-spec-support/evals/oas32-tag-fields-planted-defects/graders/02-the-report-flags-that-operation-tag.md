---
type: llm
focus: trace
weight: 1
---

The report flags that operation-tag.tsx reads `parent` as an object (`getIn(["parent", "name"])`) although the spec defines Tag `parent` as a string holding the name of another tag, so the parent never renders.
