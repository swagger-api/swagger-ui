/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Reset button in try it out", () => {
  test("should reset the edited request body value and execute try it out with the default value", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/try-it-out-reset.yaml")
    await swaggerUi.toggleOperation("#operations-default-post_users")
    await swaggerUi.tryItOut()
    // `{selectall}X` in Cypress `.type()` replaces the content, i.e. `fill("X")`
    await page
      .locator(`.parameters[data-property-name="name"] input[type=text]`)
      .fill("not the default name value")
    await page
      .locator(`.parameters[data-property-name="badgeid"] input[type=text]`)
      .fill("not the default badge value")
    await page
      .locator(`.parameters[data-property-name="email"] input[type=text]`)
      .fill("not the default email value")
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl-command")).toContainText(
      "name=not%20the%20default%20name%20value&badgeid=not%20the%20default%20badge%20value&email=not%20the%20default%20email%20value"
    )
    await page.locator(".try-out__btn.reset").click()
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl-command")).toContainText(
      "name=default%20name&badgeid=12345&email=jsmith%40business.com"
    )
  })
})
