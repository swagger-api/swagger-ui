/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5043: path-level $ref path items should inherit global consumes/produces", () => {
  test("should render consumes options correctly", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/5043/swagger.yaml")
    await swaggerUi.toggleOperation("#operations-pet-findPetsByStatus")
    await swaggerUi.tryItOut()
    // two `.content-type` selects exist (parameter + response); each cy.contains
    // succeeds if any of them has a matching option, so assert any match exists
    const contentType = page.locator(".content-type")
    await expect(
      contentType.filter({ hasText: /application\/json/ }).first()
    ).toBeAttached()
    await expect(
      contentType.filter({ hasText: /application\/xml/ }).first()
    ).toBeAttached()
    await expect(
      contentType.filter({ hasText: /text\/csv/ }).first()
    ).toBeAttached()
  })

  test("should render produces options correctly", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/5043/swagger.yaml")
    await swaggerUi.toggleOperation("#operations-pet-findPetsByStatus")
    await swaggerUi.tryItOut()
    const select = page.locator(".body-param-content-type select")
    await expect(select).toContainText("application/json")
    await expect(select).toContainText("application/xml")
    await expect(select).toContainText("text/csv")
  })
})
