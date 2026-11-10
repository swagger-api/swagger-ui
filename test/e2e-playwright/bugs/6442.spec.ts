/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#6442: 'Examples' keyword definitions can not be rendered as xml", () => {
  test("should render response examples accourdingly to content-type xml", async ({
    page,
    swaggerUi,
  }) => {
    const xmlIndicator = "<x>should be xml</x>"

    await page.goto("/?url=/documents/bugs/6442.yaml")
    await swaggerUi.toggleOperation("#operations-default-xmlTest")
    await expect(
      page.locator(".responses-wrapper").locator(".microlight")
    ).toContainText(xmlIndicator)
  })
})

test.describe("#6442: 'Example' keyword definitions can not be rendered as xml", () => {
  test("should render response examples accourdingly to content-type xml", async ({
    page,
    swaggerUi,
  }) => {
    const xmlIndicator = "<x>should be xml</x>"

    await page.goto("/?url=/documents/bugs/6442.yaml")
    await swaggerUi.toggleOperation("#operations-default-xmlTest2")
    await expect(
      page.locator(".responses-wrapper").locator(".microlight")
    ).toContainText(xmlIndicator)
  })
})
