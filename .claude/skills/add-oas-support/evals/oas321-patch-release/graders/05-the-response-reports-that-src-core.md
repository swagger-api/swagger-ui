---
type: llm
focus: trace
weight: 1
---

The response reports that src/core/plugins/oas32/wrap-components/model.jsx and models.jsx set `default$schema` to the OAS 3.2 document schema (`/oas/3.2/schema/...`) instead of a Schema Object dialect id, and either leaves it for the user to decide or fixes it while saying so.
