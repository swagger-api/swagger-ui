/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#6158: read-only property is not hidden in `POST/PUT`", () => {
  test.describe("POST", () => {
    test("should hide property 'id'", async ({ page, swaggerUi }) => {
      await page.goto("/?url=/documents/bugs/6158.yaml")
      await swaggerUi.toggleOperation("#operations-User-post_users")
      await expect(
        page.locator(".parameters[data-property-name='id']")
      ).toHaveCount(0)
      await expect(
        page.locator(".parameters[data-property-name='name']")
      ).toBeAttached()
    })
    test("should hide property 'id' when trying it out", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/6158.yaml")
      await swaggerUi.toggleOperation("#operations-User-post_users")
      await swaggerUi.tryItOut()
      await expect(
        page.locator(".parameters[data-property-name='id']")
      ).toHaveCount(0)
      await expect(page.locator("input[placeholder='id']")).toHaveCount(0)
      await expect(
        page.locator(".parameters[data-property-name='name']")
      ).toBeAttached()
      await expect(page.locator("input[placeholder='name']")).toBeAttached()
    })
  })
  test.describe("PUT", () => {
    test("should hide property 'id'", async ({ page, swaggerUi }) => {
      await page.goto("/?url=/documents/bugs/6158.yaml")
      await swaggerUi.toggleOperation("#operations-User-put_users")
      await expect(
        page.locator(".parameters[data-property-name='id']")
      ).toHaveCount(0)
      await expect(
        page.locator(".parameters[data-property-name='name']")
      ).toBeAttached()
    })
    test("should hide property 'id' when trying it out", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/6158.yaml")
      await swaggerUi.toggleOperation("#operations-User-put_users")
      await swaggerUi.tryItOut()
      await expect(
        page.locator(".parameters[data-property-name='id']")
      ).toHaveCount(0)
      await expect(page.locator("input[placeholder='id']")).toHaveCount(0)
      await expect(
        page.locator(".parameters[data-property-name='name']")
      ).toBeAttached()
      await expect(page.locator("input[placeholder='name']")).toBeAttached()
    })
  })
})
