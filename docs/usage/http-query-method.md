# The HTTP QUERY Method

Swagger UI has support for the HTTP `QUERY` method, as defined by
[RFC 10008](https://www.rfc-editor.org/rfc/rfc10008.html) and represented in
API definitions using
[OpenAPI Specification (OAS) 3.2.0's](https://spec.openapis.org/oas/v3.2.0.html#path-item-object)
native `query` Path Item field.

This document explains what `QUERY` is, how to describe a `QUERY` operation
in an API definition, and how Swagger UI renders, executes, and generates
code for it.

## What is `QUERY`?

`QUERY` is an HTTP request method, on equal footing with `GET`, `POST`,
`PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`, and `TRACE`. Per RFC 10008:

- **`QUERY` is safe.** It does not create, modify, or delete state on the
  server.
- **`QUERY` is idempotent.** Sending the same `QUERY` request multiple times
  has the same effect as sending it once.
- **`QUERY` is intended for server-side querying.** It's for cases where a
  query is too large, structured, or expressive to fit in a URI, but where a
  `GET`'s safety/idempotency semantics are still desired.
- **`QUERY` may carry request content.** Unlike `GET`, a `QUERY` request can
  have a body. The request content, together with its media type, *is* the
  query.
- **The target resource (the request URI) determines the scope of the
  query.** The URI itself does not need to change based on query content.

### `QUERY` is not `GET`, and it is not `POST`

It's tempting to think of `QUERY` as "`GET` with a body" or "`POST` but
safe". Neither framing is correct, and Swagger UI does not treat `QUERY` as
either method internally:

|                          | `GET`  | `POST` | `QUERY` |
| ------------------------ | ------ | ------ | ------- |
| Safe                     | Yes    | No     | Yes     |
| Idempotent               | Yes    | No     | Yes     |
| Can carry request content | No¹   | Yes    | Yes     |

¹ `GET` requests are not defined to carry meaningful request content.

A `QUERY` request that carries content **must** declare an appropriate
`Content-Type`, exactly like `POST` or `PUT` would. A `QUERY` request with no
content sends no body and no `Content-Type`, exactly like a bodyless `GET`
would.

### `QUERY` the method vs. `?query=` the URI syntax

Do not confuse the HTTP `QUERY` **method** with URI **query-string
parameters** (the part of a URL after `?`). They're unrelated concepts and
Swagger UI supports both simultaneously — a `QUERY` operation can have path
parameters, URI query-string parameters, headers, *and* a request body, all
at once:

```
QUERY /search?tenant=abc HTTP/1.1
Host: example.com
Content-Type: application/json
Accept: application/json

{
  "filter": {
    "status": "active"
  }
}
```

## Defining a `QUERY` operation

`QUERY` is a **native, standard Path Item field in OpenAPI 3.2.0 and
later** — it is not a vendor extension. It sits alongside `get`, `put`,
`post`, `delete`, `options`, `head`, `patch`, and `trace` as a first-class
Path Item Object field, and it is described exactly like those:

> **OpenAPI compatibility note:** `query` is only valid for documents
> declaring `openapi: 3.2.x` or later. Swagger UI does not currently offer a
> vendor-extension fallback (e.g. `x-http-method: QUERY`) for OpenAPI 2.0,
> 3.0.x, or 3.1.x documents — if your document declares an older `openapi`/
> `swagger` version, a `query` key under a path item is not a recognized
> standard operation for that version and should not be relied upon. Declare
> `openapi: 3.2.0` (or later) to use `QUERY` operations.

### YAML example

```yaml
openapi: 3.2.0
info:
  title: Example API
  version: "1.0.0"
paths:
  /search:
    query:
      summary: Search resources
      description: Execute a safe, idempotent query using request content.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                filter:
                  type: object
                  properties:
                    status:
                      type: string
                sort:
                  type: array
                  items:
                    type: string
                page:
                  type: integer
                limit:
                  type: integer
            example:
              filter:
                status: active
              sort:
                - -createdAt
              page: 1
              limit: 50
      responses:
        "200":
          description: Search results
          content:
            application/json:
              schema:
                type: object
```

### JSON example

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Example API", "version": "1.0.0" },
  "paths": {
    "/search": {
      "query": {
        "summary": "Search resources",
        "description": "Execute a safe, idempotent query using request content.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "filter": { "type": "object" },
                  "sort": { "type": "array", "items": { "type": "string" } },
                  "page": { "type": "integer" },
                  "limit": { "type": "integer" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Search results",
            "content": {
              "application/json": { "schema": { "type": "object" } }
            }
          }
        }
      }
    }
  }
}
```

A `QUERY` operation supports the same features as any other OAS3 operation:
path parameters, URI query-string parameters (`in: query` parameters —
distinct from the HTTP `QUERY` method, see above), headers, security
requirements, request bodies of any media type (JSON, text, or custom), and
response definitions.

## Rendering in the UI

`QUERY` operations render like any other method: a colored `opblock` with a
`QUERY` method badge, expandable to show parameters, the request body
editor, responses, and a "Try it out" button. The method is always shown as
literal text ("QUERY"), never conveyed by color alone, so it remains
distinguishable without relying on color perception.

## "Try it out" and request execution

`QUERY` is included in the default
[`supportedSubmitMethods`](./configuration.md) configuration, so "Try it
out" is enabled for `QUERY` operations out of the box. As with any method,
you can remove `"query"` from a custom `supportedSubmitMethods` array to
disable "Try it out" for `QUERY` operations specifically.

When you execute a `QUERY` operation, Swagger UI sends a real HTTP request
whose method is the literal token `QUERY` — never `POST`, never `GET`, and
never a `POST`/`GET` request with a method-override header. Path parameters,
query-string parameters, headers, authentication, and the request body all
work exactly as they do for `POST`/`PUT`/`PATCH` operations. `requestInterceptor`
and `responseInterceptor` see and can inspect/mutate the real `QUERY`
request and its response, the same as for any other method.

## `curl` generation

Swagger UI's generated `curl` command reflects the true request:

```bash
curl -X QUERY \
  'https://example.com/search' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"filter":{"status":"active"}}'
```

The method shown is always `QUERY`, matching the request's declared or
inferred `Content-Type` — Swagger UI does not hardcode `application/json`
for `QUERY` requests; it uses whichever media type is selected for the
request body (JSON, `multipart/form-data`, `application/x-www-form-urlencoded`,
plain text, or any other declared media type).

## CORS and browser considerations

Because `QUERY` combined with a `Content-Type` header (or other
non-"simple" headers such as `Authorization`) does not qualify as a
["simple request"](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests),
browsers issue a CORS preflight (`OPTIONS`) request before sending it,
exactly as they do for `PUT`, `PATCH`, or a `POST` with a non-form
`Content-Type`. If your API and Swagger UI are served from different
origins, your server must respond to that preflight with:

```
Access-Control-Allow-Origin: <your origin, or *>
Access-Control-Allow-Methods: QUERY, GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, <any custom headers you use>
```

See [CORS](./cors.md) for general CORS guidance — the same guidance applies
to `QUERY` operations, with `QUERY` added to the allowed methods list.

Swagger UI does not modify your server's CORS configuration; you must
configure `Access-Control-Allow-Methods: QUERY` (and any other required
headers) on your API server yourself.

`QUERY` support in the underlying transport (the browser's `fetch()`
implementation and Swagger UI's HTTP client, via `swagger-client`) requires
a browser/runtime that permits `QUERY` as a request method. `QUERY` is not
one of the methods forbidden by the Fetch standard (`CONNECT`, `TRACE`,
`TRACK`), so modern browsers permit it as an ordinary custom method token.

## Summary of the request lifecycle

```
OAS 3.2 `query` operation
    -> recognized by Swagger UI's spec parser as a valid operation
    -> rendered in the UI with a QUERY badge/color
    -> "Try it out" builds a request with method "QUERY"
    -> swagger-client preserves method: "QUERY" (case-preserved per the OAS document)
    -> the browser's fetch() sends an HTTP request with method QUERY
    -> your server receives QUERY
    -> the response is displayed in Swagger UI
    -> the equivalent curl command uses -X QUERY
```
