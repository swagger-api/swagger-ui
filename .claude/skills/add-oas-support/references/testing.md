# Testing a Version Plugin

New test files are TypeScript: `*.test.ts` / `*.test.tsx` for Jest, `*.cy.ts` for Cypress
(`CLAUDE.md`). Jest's `testMatch` (`config/jest/jest.unit.config.js`) already picks up `.ts`
and `.tsx` under `test/unit/`. Cypress doesn't: `cypress.config.js` has
`specPattern: "test/e2e-cypress/e2e/**/*.cy.{js,jsx}"`, so the first `.cy.ts` spec of a branch
must extend it to `*.cy.{js,jsx,ts,tsx}` in the same PR, or the spec silently never runs
(`NOT-TS` in `check-plugin-conventions.mjs`).

## Layout

One place per kind, named after the plugin, so that `check-field-coverage.mjs` finds them:

| Kind | Location |
|------|----------|
| Unit tests | `test/unit/core/plugins/oas3Y/` (mirror the plugin: `fn.test.ts`, `spec-extensions/wrap-selectors.test.ts`, `components/*.test.tsx`) |
| Cypress specs | `test/e2e-cypress/e2e/features/oas3Y/*.cy.ts` |
| Fixtures | `test/e2e-cypress/static/documents/oas3Y/*.yaml`, served at `/documents/oas3Y/...` |

OAS 3.2 tests are spread over `e2e/features/`, `e2e/features/oas32/` and
`e2e/features/plugins/oas32/`, with one spec duplicated in two of them. Don't extend that
pattern; use the table above.

## Parity Specs (basic support)

Basic support claims that a new-version document gets everything a parent-version document gets.
Prove it by running the parent's feature specs against copies of their fixtures with only the
version field changed:

1. List the parent's Cypress specs and fixtures:
   `grep -rln "oas3{P}" test/e2e-cypress/e2e` and
   `find test/e2e-cypress/static/documents -name "*oas3{P}*"`.
2. For each spec that exercises rendering or Try-it-out, add a new-version copy: the fixture with
   `openapi: 3.Y.0`, the spec with the new fixture URL and otherwise the same assertions.
3. A copy that needs a different assertion is not parity: it's a finding (a change in the new
   version) and belongs to a feature PR.

The 3.2 work did this for some specs
(`e2e/features/plugins/oas32/oas32-schema-expansion.cy.js` mirrors
`e2e/features/plugins/oas31/oas31-schema-expansion.cy.js`), and the copies drift: the oas31 spec
has a re-expand test the oas32 copy lacks. When a parent spec gains a test later, add it to the
copy too.

## Unit Tests

**Detection**, modelled on `test/unit/core/plugins/oas32/fn.js`: accepts `3.Y.0`, `3.Y.1`,
`3.Y.25`; rejects `3.Y`, `3.Y.01`, the parent line, `3.0.3`, `swagger: "2.0"` and a document
without a version field. Add the same negative case for the new line to the parent's detection
test (the parent must reject `3.Y.0`).

**Selectors and wrap-selectors**: call the wrapper with a stub system, as
`test/unit/core/plugins/oas32/additional-path-items.test.ts` does:

```ts
import { fromJS, List, Map } from "immutable"
import { callbacksOperations } from "core/plugins/oas32/spec-extensions/wrap-selectors"
import { validOperationMethods } from "core/plugins/oas32/selectors"

const pathItem = fromJS({
  post: { summary: "Standard" },
  additionalOperations: { "Notify-Pet": { summary: "Custom" } },
})
const system = {
  getSystem: () => ({ specSelectors: { isOAS32: () => true } }),
  oas32Selectors: { validOperationMethods },
  specSelectors: {
    specJsonWithResolvedSubtrees: () => Map({ webhooks: Map({ petChanged: pathItem }) }),
  },
}

const result = callbacksOperations(jest.fn(), system)(Map(), { callbacks, specPath })
```

Every version-gated wrapper gets a second case with `isOAS3Y: () => false` that asserts the
original selector was called and its value returned.

Build Immutable fixtures with a single `fromJS` of the whole document rather than nesting
`Map(...)`/`List(...)` by hand; the 3.2 reviews asked for exactly that.

**Several plugins together**: when behaviour depends on wrapping order (preset order, a wrapper
on top of the parent's wrapper), construct a real `System` from plugin objects, as
`test/unit/core/system/wrapSelectors.js` does
(`new System({ plugins: [probeBase, probeWrap1, probeWrap2] })`, then read selectors from
`system.getSystem()`). Behaviour across the whole preset (after-load routing, rendering) is
easier to prove in Cypress.

## Cypress Specs

Model: `test/e2e-cypress/e2e/features/oas32/oas32-additional-operations.cy.js`.

- **Load and render**: `cy.visit("/?url=/documents/oas3Y/{fixture}.yaml")`, assert the new field
  renders, and assert `.version-pragma__message--missing` does not exist.
- **Execute**: anything that changes a request (method, path, parameters, body, headers,
  security) clicks Try-it-out and Execute and asserts the request with `cy.intercept`:
  ```js
  cy.intercept(
    { method: "COPY", url: "**/pets/123" },
    { statusCode: 201, headers: corsHeaders, body: { name: "Milo" } }
  ).as("copy")

  loadWithConfig({ supportedSubmitMethods: ["COPY"] })
  cy.get(copyOperation).find(".opblock-summary-control").click()
  cy.get(copyOperation).within(() => {
    cy.get(".try-out__btn").click()
    cy.get('tr[data-param-name="id"] input').type("123")
    cy.get(".execute").click()
  })

  cy.wait("@copy").then(({ request }) => {
    expect(request.method).to.eq("COPY")
  })
  ```
  Non-simple methods need an `OPTIONS` intercept with CORS headers as well (the spec's
  `corsHeaders`).
  The mock API server (`npm run cy:mock-api`, port 3204) serves `test/e2e-selenium/db.json` for
  requests that shouldn't be stubbed.
- **Config variants**: start Swagger UI again with a config (the spec's `loadWithConfig`
  helper calls `win.SwaggerUIBundle({ url, dom_id: "#swagger-ui", presets: [...], ...config })`).
- **Older version**: one spec loads the parent-version twin of the fixture (same paths, the
  parent's `openapi` value) and asserts the new behaviour is absent, e.g. a 3.Y-only method
  doesn't render for a 3.{P} document.

Run one spec while developing:

```bash
npx start-server-and-test cy:start http://localhost:3204 "npm run cy:run -- --spec test/e2e-cypress/e2e/features/oas3Y/{spec}.cy.ts"
```

## Fixtures

- Take examples from the spec text where it has them; they exercise the field the way the
  authors meant it.
- One fixture per feature group, named after it (`additional-operations.yaml`), plus
  `oas3Y-features.yaml` for basic support. Each in-scope field of the PR appears as a key in a
  fixture, so `check-field-coverage.mjs` can see it.
- Keep the parent-version twin next to it (`additional-operations-oas3{P}.yaml`) when a test
  compares versions.
