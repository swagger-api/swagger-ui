/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Locator, Page } from "@playwright/test"

const isOpen = /(^|\s)is-open(\s|$)/
const collapsedBody = /(^|\s)json-schema-2020-12-body--collapsed(\s|$)/
const topLevelSchemas =
  ".json-schema-2020-12:not(.json-schema-2020-12--embedded)"

// Real scrolling of the virtualized list: set scrollTop on the scroll
// container (as the Cypress spec did), which fires native scroll events.
async function scrollModelsTo(page: Page, position: "bottom" | "top") {
  await page.locator(".models-scroll").evaluate((el, pos) => {
    el.scrollTop = pos === "bottom" ? el.scrollHeight : 0
  }, position)
}

// Replaces `cy.contains(".json-schema-2020-12-accordion", name)`: first accordion containing the case-sensitive text.
const accordion = (page: Page, name: string): Locator =>
  page
    .locator(".json-schema-2020-12-accordion")
    .filter({ hasText: new RegExp(name) })
    .first()

// Replaces `.closest(".json-schema-2020-12")` (nearest ancestor with that exact class token).
const closestSchema = (el: Locator): Locator =>
  el.locator(
    "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' json-schema-2020-12 ')][1]"
  )

test.describe("Models list virtualization", () => {
  test.describe("non-virtualized path — below threshold (OpenAPI 2.0)", () => {
    test("renders all model-container elements without a scroll wrapper", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/features/models.swagger.yaml")
      await expect(page.locator(".models-scroll")).toHaveCount(0)
      await expect(page.locator(".model-container")).toHaveCount(3)
    })
  })

  test.describe("virtualized path — above threshold (OpenAPI 2.0)", () => {
    const baseUrl = "/?url=/documents/perf/many-schemas.swagger.yaml"

    test("renders a scroll wrapper and mounts only a windowed subset", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".models-scroll")).toBeAttached()
      await expect
        .poll(() => page.locator(".model-container").count())
        .toBeLessThan(240)
    })

    test("section header collapse and expand still works", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".models")).toHaveClass(isOpen)
      await page.locator(".models h4 .models-control").click()
      await expect(page.locator(".models")).not.toHaveClass(isOpen)
      await expect(page.locator(".models-scroll")).toHaveCount(0)
      await page.locator(".models h4 .models-control").click()
      await expect(page.locator(".models")).toHaveClass(isOpen)
      await expect(page.locator(".models-scroll")).toBeAttached()
    })

    test("scrolling renders new items and unmounts old ones", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".models-scroll")).toBeAttached()
      await expect(page.locator("#model-PerfModel001")).toBeAttached()

      await scrollModelsTo(page, "bottom")
      await expect(page.locator("#model-PerfModel001")).toHaveCount(0)
      await expect(page.locator("#model-PerfModel240")).toBeAttached()
      await expect
        .poll(() => page.locator(".model-container").count())
        .toBeLessThan(240)
    })

    test("expanded model state is preserved when scrolled out of view and back", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      // expand first visible model
      await expect(page.locator(".models-scroll")).toBeAttached()
      await expect(
        page.locator("#model-PerfModel001 span.inner-object")
      ).toHaveCount(0)
      await page.locator("#model-PerfModel001 .model-box-control").click()
      await expect(
        page.locator("#model-PerfModel001 span.inner-object")
      ).toBeAttached()

      await scrollModelsTo(page, "bottom")
      // replaces cy.wait(200): wait until the first model is actually unmounted
      await expect(page.locator("#model-PerfModel001")).toHaveCount(0)
      await scrollModelsTo(page, "top")
      await expect(page.locator("#model-PerfModel001")).toBeAttached()

      await expect(
        page.locator("#model-PerfModel001 span.inner-object")
      ).toBeAttached()
    })

    test("expanded nested property state is preserved when scrolled out of view and back", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await page
        .locator("#model-PerfModel001 .model-box-control")
        .first()
        .click()
      await expect(
        page.locator("#model-PerfModel001 span.inner-object")
      ).toBeAttached()
      await expect(
        page.locator("#model-PerfModel001 span.inner-object .prop-type")
      ).toHaveCount(0)
      await page
        .locator("#model-PerfModel001 span.inner-object .model-box-control")
        .first()
        .click()
      await expect(
        page.locator("#model-PerfModel001 span.inner-object .prop-type")
      ).toBeAttached()

      await scrollModelsTo(page, "bottom")
      // replaces cy.wait(200): wait until the first model is actually unmounted
      await expect(page.locator("#model-PerfModel001")).toHaveCount(0)
      await scrollModelsTo(page, "top")
      await expect(page.locator("#model-PerfModel001")).toBeAttached()

      await expect(
        page.locator("#model-PerfModel001 span.inner-object .prop-type")
      ).toBeAttached()
    })
  })

  test.describe("virtualized path — above threshold (OpenAPI 3.0)", () => {
    test("renders a scroll wrapper and mounts only a windowed subset", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/perf/many-schemas.openapi.yaml")
      await expect(page.locator(".models-scroll")).toBeAttached()
      await expect
        .poll(() => page.locator(".model-container").count())
        .toBeLessThan(240)
    })
  })

  test.describe("non-virtualized path — below threshold (OpenAPI 3.1)", () => {
    test("renders all schemas without a scroll wrapper", async ({ page }) => {
      await page.goto("/?url=/documents/features/oas31-schema-expansion.yaml")
      await expect(page.locator(".models-scroll")).toHaveCount(0)
      await expect(page.locator(topLevelSchemas)).toHaveCount(1)
    })
  })

  test.describe("virtualized path — above threshold (OpenAPI 3.1)", () => {
    const baseUrl = "/?url=/documents/perf/many-schemas.openapi31.yaml"

    test("renders a scroll wrapper and mounts only a windowed subset", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".models-scroll")).toBeAttached()
      await expect
        .poll(() => page.locator(topLevelSchemas).count())
        .toBeLessThan(240)
    })

    test("section header collapse and expand still works", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".models")).toHaveClass(isOpen)
      await page.locator(".models h4 .models-control").click()
      await expect(page.locator(".models")).not.toHaveClass(isOpen)
      await expect(page.locator(".models-scroll")).toHaveCount(0)
      await page.locator(".models h4 .models-control").click()
      await expect(page.locator(".models")).toHaveClass(isOpen)
      await expect(page.locator(".models-scroll")).toBeAttached()
    })

    test("scrolling renders new items and unmounts old ones", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".models-scroll")).toBeAttached()
      await expect(accordion(page, "PerfModel001")).toBeAttached()

      await scrollModelsTo(page, "bottom")
      await expect(
        page
          .locator(".json-schema-2020-12-accordion")
          .filter({ hasText: /PerfModel001/ })
      ).toHaveCount(0)
      await expect(accordion(page, "PerfModel240")).toBeAttached()
      await expect
        .poll(() => page.locator(topLevelSchemas).count())
        .toBeLessThan(240)
    })

    test("expanded schema state is preserved when scrolled out of view and back", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".models-scroll")).toBeAttached()
      const firstBody = () =>
        closestSchema(accordion(page, "PerfModel001"))
          .locator(".json-schema-2020-12-body")
          .first()
      await expect(firstBody()).toHaveClass(collapsedBody)
      await accordion(page, "PerfModel001").click()
      await expect(firstBody()).not.toHaveClass(collapsedBody)

      await scrollModelsTo(page, "bottom")
      // replaces cy.wait(200): wait until the first schema is actually unmounted
      await expect(
        page
          .locator(".json-schema-2020-12-accordion")
          .filter({ hasText: /PerfModel001/ })
      ).toHaveCount(0)
      await scrollModelsTo(page, "top")
      await expect(accordion(page, "PerfModel001")).toBeAttached()

      await expect(firstBody()).not.toHaveClass(collapsedBody)
    })

    test("collapsed nested property state is preserved when scrolled out of view and back", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".models-scroll")).toBeAttached()

      const schema = () => closestSchema(accordion(page, "PerfModel001"))
      // `.contains("Items")` is case-sensitive and yields the first matching element
      const items = () => schema().getByText(/Items/)

      await schema()
        .locator(".json-schema-2020-12-expand-deep-button")
        .first()
        .click()
      await expect(items().first()).toBeAttached()
      await schema()
        .locator(".json-schema-2020-12-accordion")
        .filter({ hasText: /tags/ })
        .first()
        .click()
      await expect(items()).toHaveCount(0)

      await scrollModelsTo(page, "bottom")
      // replaces cy.wait(200): wait until the first schema is actually unmounted
      await expect(
        page
          .locator(".json-schema-2020-12-accordion")
          .filter({ hasText: /PerfModel001/ })
      ).toHaveCount(0)
      await scrollModelsTo(page, "top")
      await expect(accordion(page, "PerfModel001")).toBeAttached()

      await expect(
        schema().locator(".json-schema-2020-12-body").first()
      ).not.toHaveClass(collapsedBody)
      await expect(items()).toHaveCount(0)
    })
  })
})
