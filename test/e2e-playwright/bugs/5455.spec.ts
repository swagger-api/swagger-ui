/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

// http://github.com/swagger-api/swagger-ui/issues/5455

test.describe("#5455: Request bodies w/o `examples` should not render a dropdown", () => {
  test("should not render a <select> element", async ({ page, swaggerUi }) => {
    await page.goto("/?url=/documents/bugs/5455.yaml")
    await swaggerUi.toggleOperation("#operations-default-post_foo")
    const wrapper = page.locator(
      ".opblock-section-request-body > .opblock-description-wrapper"
    )
    // cy.get waits for existence first; avoid a vacuous "no descendants" pass
    await expect(wrapper).toBeAttached()
    await expect(wrapper.locator("select")).toHaveCount(0)
  })
})
