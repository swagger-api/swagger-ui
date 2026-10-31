/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#8217: Reset Request Body not using default values", () => {
  test("it reset the user edited value and executes with the default value in case of try out reset. (#6517)", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/8217.yaml")
    await swaggerUi.toggleOperation("#operations-default-addPet")
    // Expand Try It Out
    await swaggerUi.tryItOut()
    const bodyInput = page.locator(
      `.parameters[data-property-name="bodyParameter"] input`
    )
    // replace default sample with bad value (`{selectall}` + text == fill)
    await bodyInput.fill("not the default value")
    // Reset Try It Out
    await page.locator(".try-out__btn.reset").click()
    // Submit using default value
    await page.locator(".btn.execute").click()
    // No required validation error on body parameter
    await expect(bodyInput).toHaveValue("default")
    await expect(bodyInput).not.toHaveClass(/(^|\s)invalid(\s|$)/)
  })
})
