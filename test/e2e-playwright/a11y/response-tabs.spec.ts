/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Response tab elements", () => {
  test.describe("ModelExample within Operation", () => {
    test("should render Example tabpanel by default", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
      await swaggerUi.toggleOperation("#operations-default-addPet")
      await expect(
        page.locator("div[data-name=examplePanel]").first()
      ).toHaveAttribute("aria-hidden", "false")
    })
    test("should click Schema tab button and render Schema tabpanel for OpenAPI 3", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
      await swaggerUi.toggleOperation("#operations-default-addPet")
      await page.locator("button.tablinks[data-name=model]").first().click()
      await expect(
        page.locator("div[data-name=modelPanel]").first()
      ).toHaveAttribute("aria-hidden", "false")
    })
    test("should click Model tab button and render Model tabpanel for OpenAPI 2", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/petstore.swagger.yaml")
      await swaggerUi.toggleOperation("#operations-pet-addPet")
      await page.locator("button.tablinks[data-name=model]").click()
      await expect(page.locator("div[data-name=modelPanel]")).toHaveAttribute(
        "aria-hidden",
        "false"
      )
    })
  })
})
