/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

// http://github.com/swagger-api/swagger-ui/issues/5453

test.describe("#5453: Responses w/o `content` should not render ModelExample", () => {
  test("should not render a ModelExample section", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/5453.yaml")
    await swaggerUi.toggleOperation("#operations-default-get_foo")
    const responsesInner = page.locator(".responses-inner")
    // cy.get waits for existence first; avoid a vacuous "no descendants" pass
    await expect(responsesInner).toBeAttached()
    await expect(responsesInner.locator(".model-example")).toHaveCount(0)
  })
})
