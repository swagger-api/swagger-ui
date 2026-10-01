/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Parameter order", () => {
  test("should be well ordered", async ({ page, swaggerUi }) => {
    await page.goto("/?url=/documents/features/parameter-order.yaml")
    await swaggerUi.toggleOperation(
      "#operations-default-post_test__id__related__relatedId_"
    )

    // Cypress `.children().each(...)`: assert per row of the tbody
    const rows = page.locator(".parameters > tbody > *")
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toHaveAttribute("data-param-in")
      if (i === 0) {
        continue
      }
      const inValue = await rows.nth(i).getAttribute("data-param-in")
      if (!inValue) {
        continue
      }
      const beforeInValue = await rows.nth(i - 1).getAttribute("data-param-in")
      if (beforeInValue === inValue) {
        await expect(rows.nth(i - 1)).toHaveAttribute("data-param-in", inValue)
        continue
      }
      for (let x = i + 1; x < count; x++) {
        await expect(rows.nth(x)).not.toHaveAttribute(
          "data-param-in",
          beforeInValue as string
        )
      }
    }
  })
})
