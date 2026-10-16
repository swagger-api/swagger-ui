/**
 * @prettier
 */
// http://github.com/swagger-api/swagger-ui/issues/5660
import { test, expect } from "../support/fixtures"

const expectedValue = "nullable: true"

test.describe("#5660: Nullable object", () => {
  test("should render `nullable` marker for object itself", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/5660-model.yaml")
    await page.locator("#model-SomeObject .model-toggle").click()
    await expect(page.locator("#model-SomeObject > .model-box")).toContainText(
      expectedValue
    )
  })
  test("should render `nullable` marker for next object in property", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/5660-property.yaml")
    await page.locator("#model-SomeObject .model-toggle").click()
    await expect(page.locator("#model-SomeObject > .model-box")).toContainText(
      expectedValue
    )
  })
})
