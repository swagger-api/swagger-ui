/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.1.0 webhook", () => {
  test("should render the correct example for the request body", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/features/oas31-webhook-examples.yaml")
    await page.locator("#operations-webhooks-test-webhook").click()
    const example = page.locator(".body-param__example")
    await expect(example).toContainText(
      '"userId": "userId example from examples"'
    )
    await expect(example).toContainText(
      '"orderId": "orderId example from examples"'
    )
    await page
      .locator(".examples-select-element")
      .nth(0)
      .selectOption("TestExample2")
    await expect(example).toContainText(
      '"userId": "second userId example from examples"'
    )
    await expect(example).toContainText(
      '"orderId": "second orderId example from examples"'
    )
  })

  test("should render the correct example for the response", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/features/oas31-webhook-examples.yaml")
    await page.locator("#operations-webhooks-test-webhook").click()
    const example = page.locator(".example.microlight")
    await expect(example).toContainText(
      '"userId": "userId example from examples"'
    )
    await expect(example).toContainText(
      '"orderId": "orderId example from examples"'
    )
    await page
      .locator(".examples-select-element")
      .nth(1)
      .selectOption("TestExample2")
    await expect(example).toContainText(
      '"userId": "second userId example from examples"'
    )
    await expect(example).toContainText(
      '"orderId": "second orderId example from examples"'
    )
  })
})
