/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Page } from "@playwright/test"

// https://github.com/swagger-api/swagger-ui/issues/6201
// https://github.com/swagger-api/swagger-ui/issues/6250
// https://github.com/swagger-api/swagger-ui/issues/6476

test.describe("OpenAPI 3.0 Multiple Media Types with different schemas", () => {
  const mediaTypeFormData = "multipart/form-data"
  const mediaTypeUrlencoded = "application/x-www-form-urlencoded"
  const mediaTypeJson = "application/json"

  const executeBtn = (page: Page) =>
    page.locator(".execute.opblock-control__btn")
  const selectMediaType = (page: Page) =>
    page.locator(".opblock-section-request-body .content-type")
  const curlCommand = (page: Page) =>
    page.locator(".responses-wrapper .curl-command")
  // jQuery `.text()` over the set of `.curl-command span` concatenates every span's text.
  const curlText = (page: Page) => () =>
    page
      .locator(".responses-wrapper .curl-command span")
      .allTextContents()
      .then((texts) => texts.join(""))

  test.beforeEach(async ({ page, swaggerUi }) => {
    // cy.intercept(POST httpbin.org/post, {}): stub with an empty JSON body
    await page.route("**://httpbin.org/post", async (route) => {
      if (route.request().method() !== "POST") {
        await route.fallback()
        return
      }
      await route.fulfill({ status: 200, json: {} })
    })

    await page.goto("/?url=/documents/features/oas3-multiple-media-type.yaml")
    await swaggerUi.toggleOperation("#operations-default-post_post")
    // Expand Try It Out
    await swaggerUi.tryItOut()
  })

  // In all cases,
  // - assume that examples are populated based on schema (not explicitly tested)
  // - assume validation passes based on successful "execute"
  // - expect final cURL command result doees not contain unexpected artifacts from other content-type schemas
  test.describe("multipart/form-data (only 'bar')", () => {
    test("should execute multipart/form-data", async ({ page }) => {
      await selectMediaType(page).selectOption(mediaTypeUrlencoded)
      await executeBtn(page).click()
      await selectMediaType(page).selectOption(mediaTypeFormData)
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("bar")
      await expect.poll(curlText(page)).not.toContain("foo")
    })
    test("should execute application/x-www-form-urlencoded THEN execute multipart/form-data", async ({
      page,
    }) => {
      await selectMediaType(page).selectOption(mediaTypeUrlencoded)
      await executeBtn(page).click()
      await selectMediaType(page).selectOption(mediaTypeFormData)
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("bar")
      await expect.poll(curlText(page)).not.toContain("foo")
    })
    test("should execute application/json THEN execute multipart/form-data", async ({
      page,
    }) => {
      await selectMediaType(page).selectOption(mediaTypeJson)
      await executeBtn(page).click()
      await selectMediaType(page).selectOption(mediaTypeFormData)
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("bar")
      await expect.poll(curlText(page)).not.toContain("foo")
    })
  })

  test.describe("application/x-www-form-urlencoded (only 'foo')", () => {
    test("should execute application/x-www-form-urlencoded", async ({
      page,
    }) => {
      await selectMediaType(page).selectOption(mediaTypeUrlencoded)
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("foo")
      await expect.poll(curlText(page)).not.toContain("bar")
    })
    test("should execute multipart/form-data THEN execute application/x-www-form-urlencoded", async ({
      page,
    }) => {
      await selectMediaType(page).selectOption(mediaTypeFormData)
      await executeBtn(page).click()
      await selectMediaType(page).selectOption(mediaTypeUrlencoded)
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("foo")
      await expect.poll(curlText(page)).not.toContain("bar")
    })
    test("should execute application/json THEN execute application/x-www-form-urlencoded", async ({
      page,
    }) => {
      await selectMediaType(page).selectOption(mediaTypeJson)
      await executeBtn(page).click()
      await selectMediaType(page).selectOption(mediaTypeUrlencoded)
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("foo")
      await expect.poll(curlText(page)).not.toContain("bar")
    })
  })

  test.describe("application/json (both 'foo' and 'bar')", () => {
    // note: form input for "application/json" is a string; not multiple form fields
    test("should execute application/json", async ({ page }) => {
      // final curl should have both "bar" and "foo"
      await selectMediaType(page).selectOption(mediaTypeJson)
      await executeBtn(page).click()
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("foo")
      await expect.poll(curlText(page)).toContain("bar")
    })
    test("should execute multipart/form-data THEN execute application/json", async ({
      page,
    }) => {
      await selectMediaType(page).selectOption(mediaTypeFormData)
      await executeBtn(page).click()
      await selectMediaType(page).selectOption(mediaTypeJson)
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("foo")
      await expect.poll(curlText(page)).toContain("bar")
    })
    test("should execute application/x-www-form-urlencoded THEN execute application/json", async ({
      page,
    }) => {
      // final curl should have both "bar" and "foo"
      await selectMediaType(page).selectOption(mediaTypeUrlencoded)
      await executeBtn(page).click()
      await selectMediaType(page).selectOption(mediaTypeJson)
      await executeBtn(page).click()
      // cURL component
      await expect(curlCommand(page)).toBeAttached()
      await expect.poll(curlText(page)).toContain("foo")
      await expect.poll(curlText(page)).toContain("bar")
    })
  })
})
