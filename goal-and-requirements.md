---
id: swagger-ui
type: goal-and-requirements
status: draft
title: Swagger UI — goal and requirements
---

## Goal

Swagger UI turns an OpenAPI definition into interactive API documentation that runs in the
browser. Developers and API consumers can read an API and call it without any implementation
logic in place. The page is generated entirely from the definition document.

## Problem

API definitions are machine-readable but hard for people to read. Without a renderer, consumers
read raw YAML/JSON, and producers have to hand-maintain docs that drift from the contract.
Swagger UI makes the definition itself the documentation, and lets readers exercise the live API
from the same page.

## Audience

- **API producers** who publish docs for their API: they embed Swagger UI in a site, serve the
  static `dist`, or run the Docker image.
- **API consumers** who read those docs and try requests.
- **Integrators** who extend or restyle the UI through the plugin system, or embed it in a
  React app.

## Capabilities

- **Render definitions** in OpenAPI 2.0 (Swagger), 3.0.x, 3.1.x and 3.2.x: info, servers, tags,
  operations, parameters, request bodies, responses, schemas/models, webhooks (3.1+), and
  vendor extensions. The document's version is detected from its `swagger`/`openapi` field. A
  document with an unsupported or ambiguous version gets an explanatory message instead of
  being rendered.
- **Load definitions** from a URL, from an inline object, or from a list of named URLs the
  reader can pick from. External `$ref`s are resolved through `swagger-client`.
- **Try it out**: build requests from parameter and body input, send them from the browser, and
  show the live response. Generate request snippets (curl variants) for the same request.
- **Authorize** with API keys, HTTP basic/bearer, and OAuth2 (implicit, authorization code with
  PKCE, password, client credentials), using a popup redirect page. Authorization can persist
  across reloads.
- **Navigate**: deep links to tags and operations, filtering operations by tag and path, and
  expand/collapse control.
- **Generate examples** for request and response bodies from schemas: JSON, YAML, XML, and
  form data.
- **Configure** the UI through options taken from code, the query string (opt-in), or a remote
  config URL.
- **Customize** through plugins and presets that add, replace, or wrap components, state
  actions, selectors, and helper functions.
- **Ship in several forms**: the `swagger-ui` npm module, the dependency-free `swagger-ui-dist`
  package and `dist/` folder, the `swagger-ui-react` component, the `swaggerapi/swagger-ui`
  Docker image, and Packagist. See [architecture](architecture.md).

## Principles

- **Safe to render untrusted definitions.** Content from a definition (Markdown, URLs) is
  sanitized before it reaches the DOM. HTML goes through DOMPurify, and links go through
  `sanitizeUrl`.
- **Extensibility through the system, not forks.** Core behaviour is exposed so that a plugin
  can override or wrap it. Components are looked up by name (`getComponent`), not imported.
- **Supporting a new OpenAPI version never changes how older versions render.** Each version's
  behaviour is gated on that version being detected.
- **Backward compatibility of the public API.** The options, `SwaggerUI.*` exports, and plugin
  API are kept stable within a major version. Deprecations are announced before removal.

## Non-goals

- **Authoring or editing definitions.** This is SwaggerEditor's job. Swagger UI is a read and
  try-out surface.
- **Validating definitions.** Validation is delegated to the external validator badge and to
  the upstream parsers (swagger-client/ApiDOM). The UI shows parse and resolve errors only.
- **Localization (l10n).** The UI ships in English only.
- **Swagger 1.x and other pre-2.0 documents.** Support for these ended with Swagger UI 2.x.
