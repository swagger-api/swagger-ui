---
tags: [add-json-schema-support, regression]
max_turns: 80
timeout_seconds: 1800
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, WebFetch]
---

We want Swagger UI to render standalone JSON Schema 2020-12 documents (no openapi field, just a schema with $schema at the root) - SwaggerEditor's preview will use it later. There's a design doc in Confluence ("Standalone JSON Schema", SHUB space), you probably can't open it. Plan the Swagger UI part and write the plan to ADD-JSON-SCHEMA-2020-12.md in the repo root. No code yet.
