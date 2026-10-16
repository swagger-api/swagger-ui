/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5129: parameter required + allowEmptyValue interactions", () => {
  test.describe("allowEmptyValue parameter", () => {
    const opId = "#operations-default-get_aev"

    test("should omit the parameter by default", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/5129.yaml")
      await swaggerUi.toggleOperation(opId)
      await page.locator(".btn.try-out__btn").click()
      await page.locator(".btn.execute").click()
      await expect(page.locator(".request-url pre")).toHaveText(
        "http://localhost:3230/aev"
      )
    })

    test("should include a value", async ({ page, swaggerUi }) => {
      await page.goto("/?url=/documents/bugs/5129.yaml")
      await swaggerUi.toggleOperation(opId)
      await page.locator(".btn.try-out__btn").click()
      await page
        .locator(`.parameters-col_description input[type=text]`)
        .fill("asdf")
      await page.locator(".btn.execute").click()
      await expect(page.locator(".request-url pre")).toHaveText(
        "http://localhost:3230/aev?param=asdf"
      )
    })

    test("should include an empty value when empty value box is checked", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/5129.yaml")
      await swaggerUi.toggleOperation(opId)
      await page.locator(".btn.try-out__btn").click()
      await page
        .locator(`.parameters-col_description input[type=checkbox]`)
        .check()
      await page.locator(".btn.execute").click()
      await expect(page.locator(".request-url pre")).toHaveText(
        "http://localhost:3230/aev?param="
      )
    })

    test("should include a value when empty value box is checked and then input is provided", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/5129.yaml")
      await swaggerUi.toggleOperation(opId)
      await page.locator(".btn.try-out__btn").click()
      await page
        .locator(`.parameters-col_description input[type=checkbox]`)
        .check()
      await page
        .locator(`.parameters-col_description input[type=text]`)
        .fill("1234")
      await page.locator(".btn.execute").click()
      await expect(page.locator(".request-url pre")).toHaveText(
        "http://localhost:3230/aev?param=1234"
      )
    })
  })

  test.describe("allowEmptyValue + required parameter", () => {
    const opId = "#operations-default-get_aev_and_required"

    test("should refuse to execute by default", async ({ page, swaggerUi }) => {
      await page.goto("/?url=/documents/bugs/5129.yaml")
      await swaggerUi.toggleOperation(opId)
      await page.locator(".btn.try-out__btn").click()
      await page.locator(".btn.execute").click()
      // replaces cy.wait(1000): the failed validation marks the input invalid,
      // which proves Execute was processed before asserting no request was made
      await expect(
        page.locator(`.parameters-col_description input[type=text]`)
      ).toHaveClass(/invalid/)
      await expect(page.locator(".request-url pre")).toHaveCount(0)
    })

    test("should include a value", async ({ page, swaggerUi }) => {
      await page.goto("/?url=/documents/bugs/5129.yaml")
      await swaggerUi.toggleOperation(opId)
      await page.locator(".btn.try-out__btn").click()
      await page
        .locator(`.parameters-col_description input[type=text]`)
        .fill("asdf")
      await page.locator(".btn.execute").click()
      await expect(page.locator(".request-url pre")).toHaveText(
        "http://localhost:3230/aev/and/required?param=asdf"
      )
    })

    test("should include an empty value when empty value box is checked", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/5129.yaml")
      await swaggerUi.toggleOperation(opId)
      await page.locator(".btn.try-out__btn").click()
      await page
        .locator(`.parameters-col_description input[type=checkbox]`)
        .check()
      await page.locator(".btn.execute").click()
      await expect(page.locator(".request-url pre")).toHaveText(
        "http://localhost:3230/aev/and/required?param="
      )
    })

    test("should include a value when empty value box is checked and then input is provided", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/5129.yaml")
      await swaggerUi.toggleOperation(opId)
      await page.locator(".btn.try-out__btn").click()
      await page
        .locator(`.parameters-col_description input[type=checkbox]`)
        .check()
      await page
        .locator(`.parameters-col_description input[type=text]`)
        .fill("1234")
      await page.locator(".btn.execute").click()
      await expect(page.locator(".request-url pre")).toHaveText(
        "http://localhost:3230/aev/and/required?param=1234"
      )
    })
  })
})
