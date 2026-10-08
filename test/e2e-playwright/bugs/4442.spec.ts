/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("UI #4442: Parameter.content display and execution", () => {
  test("should display textareas as static documentation according to the `example`", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/4442.yaml")
    await swaggerUi.toggleOperation("#operations-default-get_")
    await page.locator(".btn.try-out__btn").click()
    await expect(
      page.locator(`div.json-schema-array > div:nth-child(1) > div > textarea`)
    ).toHaveValue(`{\n  "userId": 1,\n  "currency": "USD"\n}`)
    await expect(
      page.locator(`div.json-schema-array > div:nth-child(2) > div > textarea`)
    ).toHaveValue(`{\n  "userId": 2,\n  "currency": "CAD"\n}`)
  })

  test("should serialize JSON into a query correctly", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/4442.yaml")
    await swaggerUi.toggleOperation("#operations-default-get_")
    await page.locator(".btn.try-out__btn").click()
    await page.locator(".btn.execute").click()
    await expect(page.locator(".request-url pre")).toHaveText(
      `http://localhost:3230/?users=${encodeURIComponent(
        `[{"userId":1,"currency":"USD"},{"userId":2,"currency":"CAD"}]`
      )}`
    )
  })
})
