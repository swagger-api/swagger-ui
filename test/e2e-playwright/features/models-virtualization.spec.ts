/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { SchemaLocators } from "../support/fixtures"
import type { Locator } from "@playwright/test"

const isOpen = /(^|\s)is-open(\s|$)/

// Real scrolling of the virtualized list: set scrollTop on the scroll
// container (as the Cypress spec did), which fires native scroll events.
async function scrollTo(scrollContainer: Locator, position: "bottom" | "top") {
  await scrollContainer.evaluate((el, pos) => {
    el.scrollTop = pos === "bottom" ? el.scrollHeight : 0
  }, position)
}

// Replaces `cy.contains(".json-schema-2020-12-accordion", name)`: first accordion containing the case-sensitive text.
const accordion = (schemaUi: SchemaLocators, name: string): Locator =>
  schemaUi
    .accordion()
    .filter({ hasText: new RegExp(name) })
    .first()

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

      await scrollTo(page.locator(".models-scroll"), "bottom")
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

      await scrollTo(page.locator(".models-scroll"), "bottom")
      // replaces cy.wait(200): wait until the first model is actually unmounted
      await expect(page.locator("#model-PerfModel001")).toHaveCount(0)
      await scrollTo(page.locator(".models-scroll"), "top")
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

      await scrollTo(page.locator(".models-scroll"), "bottom")
      // replaces cy.wait(200): wait until the first model is actually unmounted
      await expect(page.locator("#model-PerfModel001")).toHaveCount(0)
      await scrollTo(page.locator(".models-scroll"), "top")
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
    test("renders all schemas without a scroll wrapper", async ({
      page,
      schemaUi,
    }) => {
      await page.goto("/?url=/documents/features/oas31-schema-expansion.yaml")
      await expect(schemaUi.modelsScroll()).toHaveCount(0)
      await expect(schemaUi.topLevelSchema()).toHaveCount(1)
    })
  })

  test.describe("virtualized path — above threshold (OpenAPI 3.1)", () => {
    const baseUrl = "/?url=/documents/perf/many-schemas.openapi31.yaml"

    test("renders a scroll wrapper and mounts only a windowed subset", async ({
      page,
      schemaUi,
    }) => {
      await page.goto(baseUrl)
      await expect(schemaUi.modelsScroll()).toBeAttached()
      await expect
        .poll(() => schemaUi.topLevelSchema().count())
        .toBeLessThan(240)
    })

    test("section header collapse and expand still works", async ({
      page,
      schemaUi,
    }) => {
      await page.goto(baseUrl)
      await schemaUi.expectModelsOpen(true)
      await schemaUi.modelsControl().click()
      await schemaUi.expectModelsOpen(false)
      await expect(schemaUi.modelsScroll()).toHaveCount(0)
      await schemaUi.modelsControl().click()
      await schemaUi.expectModelsOpen(true)
      await expect(schemaUi.modelsScroll()).toBeAttached()
    })

    test("scrolling renders new items and unmounts old ones", async ({
      page,
      schemaUi,
    }) => {
      await page.goto(baseUrl)
      await expect(schemaUi.modelsScroll()).toBeAttached()
      await expect(accordion(schemaUi, "PerfModel001")).toBeAttached()

      await scrollTo(schemaUi.modelsScroll(), "bottom")
      await expect(
        schemaUi.accordion().filter({ hasText: /PerfModel001/ })
      ).toHaveCount(0)
      await expect(accordion(schemaUi, "PerfModel240")).toBeAttached()
      await expect
        .poll(() => schemaUi.topLevelSchema().count())
        .toBeLessThan(240)
    })

    test("expanded schema state is preserved when scrolled out of view and back", async ({
      page,
      schemaUi,
    }) => {
      await page.goto(baseUrl)
      await expect(schemaUi.modelsScroll()).toBeAttached()
      const firstSchema = () =>
        schemaUi.closestSchema(accordion(schemaUi, "PerfModel001"))
      await schemaUi.expectSchemaExpanded(firstSchema(), false)
      await accordion(schemaUi, "PerfModel001").click()
      await schemaUi.expectSchemaExpanded(firstSchema(), true)

      await scrollTo(schemaUi.modelsScroll(), "bottom")
      // replaces cy.wait(200): wait until the first schema is actually unmounted
      await expect(
        schemaUi.accordion().filter({ hasText: /PerfModel001/ })
      ).toHaveCount(0)
      await scrollTo(schemaUi.modelsScroll(), "top")
      await expect(accordion(schemaUi, "PerfModel001")).toBeAttached()

      await schemaUi.expectSchemaExpanded(firstSchema(), true)
    })

    test("collapsed nested property state is preserved when scrolled out of view and back", async ({
      page,
      schemaUi,
    }) => {
      await page.goto(baseUrl)
      await expect(schemaUi.modelsScroll()).toBeAttached()

      const schema = () =>
        schemaUi.closestSchema(accordion(schemaUi, "PerfModel001"))
      // `.contains("Items")` is case-sensitive and yields the first matching element
      const items = () => schema().getByText(/Items/)

      await schemaUi.expandDeepButton(schema()).first().click()
      await expect(items().first()).toBeAttached()
      await schemaUi
        .accordion(schema())
        .filter({ hasText: /tags/ })
        .first()
        .click()
      await expect(items()).toHaveCount(0)

      await scrollTo(schemaUi.modelsScroll(), "bottom")
      // replaces cy.wait(200): wait until the first schema is actually unmounted
      await expect(
        schemaUi.accordion().filter({ hasText: /PerfModel001/ })
      ).toHaveCount(0)
      await scrollTo(schemaUi.modelsScroll(), "top")
      await expect(accordion(schemaUi, "PerfModel001")).toBeAttached()

      await schemaUi.expectSchemaExpanded(schema(), true)
      await expect(items()).toHaveCount(0)
    })
  })
})
