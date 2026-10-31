# Testing a Version Plugin

New test files are TypeScript: `*.test.ts` / `*.test.tsx` for Jest, `*.spec.ts` for Playwright
(`CLAUDE.md`). Jest's `testMatch` (`config/jest/jest.unit.config.js`) already picks up `.ts`
and `.tsx` under `test/unit/`, and Playwright runs `.spec.ts` natively. `npm run e2e:typecheck`
type-checks the specs (Playwright itself doesn't).

## Layout

One place per kind, named after the plugin, so that `check-field-coverage.mjs` finds them:

| Kind | Location |
|------|----------|
| Unit tests | `test/unit/core/plugins/oas3Y/` (mirror the plugin: `fn.test.ts`, `spec-extensions/wrap-selectors.test.ts`, `components/*.test.tsx`) |
| Playwright specs | `test/e2e-playwright/features/oas3Y/*.spec.ts` |
| Fixtures | `test/e2e-playwright/static/documents/oas3Y/*.yaml`, served at `/documents/oas3Y/...` |

Existing OAS 3.2 specs sit in `features/` and `features/oas32/`; put new ones in
`features/oas3Y/` as in the table above.

## Parity Specs (basic support)

Basic support claims that a new-version document gets everything a parent-version document gets.
Prove it by running the parent's feature specs against copies of their fixtures with only the
version field changed:

1. List the parent's Playwright specs and fixtures:
   `grep -rln "oas3{P}" test/e2e-playwright/features` and
   `find test/e2e-playwright/static/documents -name "*oas3{P}*"`.
2. For each spec that exercises rendering or Try-it-out, add a new-version copy: the fixture with
   `openapi: 3.Y.0`, the spec with the new fixture URL and otherwise the same assertions.
3. A copy that needs a different assertion is not parity: it's a finding (a change in the new
   version) and belongs to a feature PR.

The 3.2 work did this for some specs (`features/plugins/oas32/oas32-schema-expansion.spec.ts`
mirrors `features/plugins/oas31/oas31-schema-expansion.spec.ts`), and copies can drift when a
parent spec gains a test later. Add it to the copy too.

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
easier to prove in Playwright.

## Playwright Specs

Model: `test/e2e-playwright/features/oas32/oas32-additional-operations.spec.ts`. Import `test`
and `expect` from `test/e2e-playwright/support/fixtures`, not from `@playwright/test`: the shared
fixture fails a test on uncaught page exceptions and provides `swaggerUi` helpers.

- **Load and render**: `await page.goto("/?url=/documents/oas3Y/{fixture}.yaml")`, assert the new
  field renders, and assert `.version-pragma__message--missing` has count 0.
- **Execute**: anything that changes a request (method, path, parameters, body, headers,
  security) clicks Try-it-out and Execute and asserts the request with `page.route`:
  ```ts
  let copyRequest: { method: string; destination?: string } | undefined
  await page.route("**/pets/123", async (route) => {
    const request = route.request()
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders })
    } else if (request.method() === "COPY") {
      copyRequest = {
        method: request.method(),
        destination: (await request.allHeaders()).destination,
      }
      await route.fulfill({
        status: 201,
        headers: corsHeaders,
        contentType: "application/json",
        body: JSON.stringify({ name: "Milo" }),
      })
    } else {
      await route.fallback()
    }
  })

  await loadWithConfig(page, { supportedSubmitMethods: ["COPY"] })
  const copy = page.locator(copyOperation)
  await copy.locator(".opblock-summary-control").click()
  await copy.locator(".try-out__btn").click()
  await copy.locator('tr[data-param-name="id"] input').fill("123")
  await copy.locator(".execute").click()

  await expect(copy.locator(".live-responses-table")).toContainText("201")
  expect(copyRequest).toEqual({ method: "COPY", destination: "/pets/456" })
  ```
  Non-simple methods need an `OPTIONS` route with CORS headers as well (the spec's
  `corsHeaders`). Wait on a UI assertion (the response table) before asserting what the route
  captured.
  The mock API server (`npm run e2e:mock-api`, port 3204) serves `test/e2e-selenium/db.json` for
  requests that shouldn't be stubbed; `npm run e2e` starts it for you.
- **Config variants**: start Swagger UI again with a config (the spec's `loadWithConfig` helper
  runs `page.evaluate` that calls
  `window.SwaggerUIBundle({ url, dom_id: "#swagger-ui", presets: [...], ...config })`).
- **Older version**: one spec loads the parent-version twin of the fixture (same paths, the
  parent's `openapi` value) and asserts the new behaviour is absent, e.g. a 3.Y-only method
  doesn't render for a 3.{P} document.
- **Strict mode**: a locator that matches several elements fails an assertion; narrow it or use
  `.first()` deliberately.

Run one spec while developing (starts the dev server and mock API itself):

```bash
npm run e2e -- test/e2e-playwright/features/oas3Y/{spec}.spec.ts
```

## Fixtures

- Take examples from the spec text where it has them; they exercise the field the way the
  authors meant it.
- One fixture per feature group, named after it (`additional-operations.yaml`), plus
  `oas3Y-features.yaml` for basic support. Each in-scope field of the PR appears as a key in a
  fixture, so `check-field-coverage.mjs` can see it.
- Keep the parent-version twin next to it (`additional-operations-oas3{P}.yaml`) when a test
  compares versions.
