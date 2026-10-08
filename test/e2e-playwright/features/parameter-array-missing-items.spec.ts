/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Parameter - Invalid definition with missing array 'items' (#7375)", () => {
  test("should render gracefully with fallback to default value", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(
      "/?url=/documents/features/parameter-array-missing-items.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-get_example1")
    const textarea = page.locator(
      "tbody > tr > .parameters-col_description textarea"
    )
    await expect(textarea).toBeAttached()
    await expect(textarea).toContainText("{}")
  })
})
