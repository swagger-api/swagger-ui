/**
 * @prettier
 */
import {
  VIRTUALIZE_OPERATIONS_TAG_ESTIMATE_SIZE,
  VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE,
} from "core/utils/virtualization"
import type { Page } from "@playwright/test"
import { test, expect } from "../support/fixtures"

// Real window scrolling (the virtualizer reacts to scroll events), `cy.scrollTo`
// equivalents.
const scrollToBottom = (page: Page) =>
  page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
const scrollToTop = (page: Page) => page.evaluate(() => window.scrollTo(0, 0))
const scrollToY = (page: Page, y: number) =>
  page.evaluate((top) => window.scrollTo(0, top), y)

test.describe("Operations list virtualization", () => {
  test.describe("non-virtualized path", () => {
    test("renders .opblock-tag-section wrappers and all operations", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/features/deep-linking.swagger.yaml")
      await expect(page.locator(".opblock-tag-section").first()).toBeAttached()
      await expect(page.locator(".opblock")).toHaveCount(5)
    })
  })

  test.describe("virtualized path", () => {
    const baseUrl = "/?url=/documents/perf/many-operations.yaml"

    test("does not render .opblock-tag-section wrappers", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(page.locator("#operations-tag-perfTag01")).toBeAttached()
      await expect(page.locator(".opblock-tag-section")).toHaveCount(0)
    })

    test("mounts only a windowed subset of operations", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(page.locator("#operations-tag-perfTag01")).toBeAttached()
      // Cypress `have.length.lessThan` retried until it held
      await expect
        .poll(() => page.locator(".opblock").count())
        .toBeLessThan(529)
    })

    test("scrolling renders new items and unmounts old ones", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(
        page.locator("#operations-perfTag01-perfOp01_01")
      ).toBeAttached()
      await scrollToBottom(page)
      await expect(
        page.locator("#operations-perfTag24-perfOp24_22")
      ).toBeAttached()
      await expect(
        page.locator("#operations-perfTag01-perfOp01_01")
      ).toHaveCount(0)
    })

    test("collapsing a tag removes its operations, expanding restores them", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(
        page.locator("#operations-tag-perfTag01[data-is-open='true']")
      ).toBeAttached()
      await expect(
        page.locator("#operations-perfTag01-perfOp01_01")
      ).toBeAttached()

      await page.locator("#operations-tag-perfTag01").click()
      await expect(
        page.locator("#operations-tag-perfTag01[data-is-open='false']")
      ).toBeAttached()
      await expect(
        page.locator("#operations-perfTag01-perfOp01_01")
      ).toHaveCount(0)

      await page.locator("#operations-tag-perfTag01").click()
      await expect(
        page.locator("#operations-tag-perfTag01[data-is-open='true']")
      ).toBeAttached()
      await expect(
        page.locator("#operations-perfTag01-perfOp01_01")
      ).toBeAttached()
    })

    test("expanding an operation does not reset on scroll", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(
        page.locator("#operations-tag-perfTag01[data-is-open='true']")
      ).toBeAttached()

      const firstOp = () => page.locator(".opblock").first()
      await firstOp().locator(".opblock-summary").click()
      await expect(firstOp().locator(".opblock-body")).toBeVisible()

      await scrollToBottom(page)
      // replaces `cy.wait(300)`: wait until the first operation got unmounted
      await expect(
        page.locator("#operations-perfTag01-perfOp01_01")
      ).toHaveCount(0)
      await scrollToTop(page)
      // replaces `cy.wait(300)`: wait until the first operation is mounted again
      await expect(
        page.locator("#operations-perfTag01-perfOp01_01")
      ).toBeAttached()

      await expect(firstOp().locator(".opblock-body")).toBeVisible()
    })

    test("multi-tag operation is rendered under both of its tags", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(page.locator("#operations-tag-perfTag01")).toBeAttached()

      // perfTag01 header + 22 regular ops before multiTagged
      const multiTaggedUnderTag01 =
        VIRTUALIZE_OPERATIONS_TAG_ESTIMATE_SIZE +
        22 * VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE
      await scrollToY(page, multiTaggedUnderTag01)
      await expect(
        page.locator("#operations-perfTag01-multiTagged")
      ).toBeAttached()
      await page
        .locator("#operations-perfTag01-multiTagged")
        .locator(".opblock-summary")
        .click()
      await expect(
        page
          .locator("#operations-perfTag01-multiTagged")
          .locator(".opblock-body")
      ).toBeVisible()

      // scroll past first multiTagged and through perfTag02 to its multiTagged
      await scrollToY(
        page,
        2 * multiTaggedUnderTag01 + VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE
      )
      await expect(
        page.locator("#operations-perfTag02-multiTagged")
      ).toBeAttached()
      await expect(
        page
          .locator("#operations-perfTag02-multiTagged")
          .locator(".opblock-body")
      ).toHaveCount(0)
    })
  })

  test.describe("deep linking", () => {
    test("deep link to an operation scrolls to it", async ({ page }) => {
      await page.goto(
        "/?deepLinking=true&url=/documents/perf/many-operations.yaml#/perfTag15/perfOp15_01"
      )
      await expect(
        page.locator("#operations-tag-perfTag15[data-is-open='true']")
      ).toBeAttached({ timeout: 8000 })
    })

    test("deep link to a tag header scrolls to it", async ({ page }) => {
      await page.goto(
        "/?deepLinking=true&url=/documents/perf/many-operations.yaml#/perfTag15"
      )
      await expect(page.locator("#operations-tag-perfTag15")).toBeAttached({
        timeout: 8000,
      })
    })
  })
})
