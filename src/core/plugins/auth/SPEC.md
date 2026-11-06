---
id: auth
type: module-design
status: draft
title: Auth — security schemes and authorization flows
parent: architecture
depends-on: [core-runtime, document-lifecycle, oas-versions]
---

## Responsibility

Owns everything between a definition's security schemes and the credentials attached to an
executed request:

- the `auth` state slice, which holds the authorized schemes and their values;
- the Authorize dialog and its per-scheme forms (`components/`, plus the shared auth components
  in `src/core/components/auth`);
- the OAuth2 flows: implicit, authorization code (with PKCE when `initOAuth` sets
  `usePkceWithAuthorizationCodeGrant`), password, and client credentials;
- the root injects `initOAuth`, `preauthorizeApiKey`, and `preauthorizeBasic`, which let the host
  page provide credentials up front;
- persistence of authorization across reloads.

## Contracts

- **Request injection.** Auth wraps `specActions.execute` to add the `securities` an operation
  needs. The request itself is built by [document-lifecycle](../spec/SPEC.md).
- **Restore on config.** It wraps `configsActions.loaded` to restore persisted authorization.
  With `persistAuthorization`, the authorized state lives in `localStorage["authorized"]`.
- **Cookie API keys.** An apiKey that goes `in: cookie` is written to `document.cookie`. Browsers
  forbid some headers (`docs/usage/limitations.md`), so cookie parameters in general cannot be
  sent from the browser.
- **OAuth2 popup.** `src/core/oauth2-authorize.js` builds the authorize URL from a sanitized
  `authorizationUrl`, `oauth2RedirectUrl`, `state`, and the PKCE challenge, then calls
  `authActions.authPopup`. That stores the callback on
  `window.swaggerUIRedirectOauth2` and opens the popup. The shipped `oauth2-redirect.html`
  checks `state` and calls back into `preAuthorizeImplicit` or
  `authorizeAccessCodeWith{FormParams|BasicAuthentication}`, which exchange the code through
  `fn.fetch`. The redirect page is part of the public contract: its source is
  `dev-helpers/oauth2-redirect.{html,js}`, the bundle build copies it into `dist/`, and it is
  exported as `swagger-ui/dist/oauth2-redirect.html`.
- OAS 3.x scheme shapes (HTTP auth and OAuth2 `flows`) come through `oas3Selectors` and the
  version plugins ([oas-versions](../oas3/SPEC.md)). For 3.1, `mutualTLS` is rendered by oas31's
  auth wrappers.

## Known limitations

- **Predictable OAuth2 `state`.** It is `btoa(new Date())`, which can be guessed, so it gives
  weak CSRF protection. It should be a random value.
- **No `mutualTLS` for OAS 3.2.** The oas31 wrappers are gated on `isOAS31` only.
- `authSelectors.getDefinitionsByNames` is deprecated.
