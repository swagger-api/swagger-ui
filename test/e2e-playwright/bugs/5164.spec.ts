/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5164: multipart property initial values", () => {
  test("should provide correct initial values for objects and arrays", async ({
    page,
    swaggerUi,
  }) => {
    const correctObjectValue = JSON.stringify(
      {
        one: "abc",
        two: 123,
      },
      null,
      2
    )

    await page.goto("?url=/documents/bugs/5164.yaml")
    await swaggerUi.toggleOperation("#operations-default-post_")
    await swaggerUi.tryItOut()
    await expect(
      page.locator(`.parameters[data-property-name="first"] textarea`)
    ).toHaveValue(correctObjectValue)
    // Cypress `have.value` read the first matched input (the text input;
    // the second match is the disabled "include empty value" checkbox)
    await expect(
      page.locator(`.parameters[data-property-name="second"] input`).first()
    ).toHaveValue("hi")
  })
})
