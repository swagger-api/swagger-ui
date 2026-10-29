/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#6475: 'Examples' keyword definitions can not be rendered as xml", () => {
  test("should render requestBody examples preview accourdingly to content-type xml", async ({
    page,
    swaggerUi,
  }) => {
    const xmlIndicator = "<x>should be xml</x>"

    await page.goto("/?url=/documents/bugs/6475.yaml")
    await swaggerUi.toggleOperation("#operations-default-xmlTest_examples")
    await expect(
      page.locator(".opblock-section-request-body").locator(".microlight")
    ).toContainText(xmlIndicator)
  })
  test("should requestBody examples input accourdingly to content-type xml", async ({
    page,
    swaggerUi,
  }) => {
    const xmlIndicator = "<x>should be xml</x>"

    await page.goto("/?url=/documents/bugs/6475.yaml")
    await swaggerUi.toggleOperation("#operations-default-xmlTest_examples")
    await page.locator(".btn.try-out__btn").click()
    await expect(
      page.locator(".opblock-section-request-body").locator("textarea")
    ).toContainText(xmlIndicator)
  })
})

test.describe("#6475: 'Example' keyword definitions can not be rendered as xml", () => {
  test("should render requestBody examples preview accourdingly to content-type xml", async ({
    page,
    swaggerUi,
  }) => {
    const xmlIndicator = "<x>should be xml</x>"

    await page.goto("/?url=/documents/bugs/6475.yaml")
    await swaggerUi.toggleOperation("#operations-default-xmlTest_example")
    await expect(
      page.locator(".opblock-section-request-body").locator(".microlight")
    ).toContainText(xmlIndicator)
  })
  test("should requestBody examples input accourdingly to content-type xml", async ({
    page,
    swaggerUi,
  }) => {
    const xmlIndicator = "<x>should be xml</x>"

    await page.goto("/?url=/documents/bugs/6475.yaml")
    await swaggerUi.toggleOperation("#operations-default-xmlTest_example")
    await page.locator(".btn.try-out__btn").click()
    await expect(
      page.locator(".opblock-section-request-body").locator("textarea")
    ).toContainText(xmlIndicator)
  })
})
