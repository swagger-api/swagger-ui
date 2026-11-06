---
id: docker-image
type: module-design
status: draft
title: Docker image — swaggerapi/swagger-ui
parent: architecture
depends-on:
  - standalone
---

## Responsibility

Serves the built `dist/` as a static site from `nginx:alpine` (root `Dockerfile`), configured
entirely through environment variables at container start. The user-facing references are
`docs/usage/installation.md` (Docker section) and the Docker section of
`docs/usage/configuration.md`.

## Runtime config contract

- **Initializer rewrite.** At start, `docker-entrypoint.d/40-swagger-ui.sh` runs `configurator/`,
  which replaces the "Changeable Configuration Block" in `swagger-initializer.js` with a
  `SwaggerUIBundle({...})` call. If the markers are missing, it warns and leaves the file as it
  is.
- **Base config** (`translator.js`): the apis and standalone presets, the DownloadUrl plugin,
  `StandaloneLayout`, `deepLinking`, and `#swagger-ui`.
- **Env var to option mapping.**
  - `variables.js` maps option variables onto `SwaggerUI` options: `URL`, `URLS`,
    `URLS_PRIMARY_NAME`, `SPEC`, `CONFIG_URL`, `LAYOUT`, `DOC_EXPANSION`, `FILTER`,
    `PERSIST_AUTHORIZATION`, `WITH_CREDENTIALS`, and others. `API_URL`/`API_URLS` are legacy
    aliases.
  - `oauth.js` maps the `OAUTH_*` variables onto `initOAuth`.
- **Server-level variables, handled by the entrypoint script:**
  - `SWAGGER_JSON` (a local file) and `SWAGGER_JSON_URL`;
  - `BASE_URL`/`SWAGGER_ROOT` (nginx path rewrite);
  - `PORT`/`PORT_IPV6`;
  - `CORS`: permissive CORS headers. The default is `true`; any other value turns them off.
  - `EMBEDDING`: the default `false` sends `X-Frame-Options: DENY` and
    `frame-ancestors 'none'`; any other value allows framing.

  Defaults are the Dockerfile's `ENV`.
- **Publishing.** `:latest` and `:vX` are pushed after each release, and `:unstable` after CI
  passes on `main`. The image is multi-arch, and the security-scan workflow runs Trivy on
  `:unstable` daily. The docker release job rebuilds `dist` instead of reusing the release
  artifact.
