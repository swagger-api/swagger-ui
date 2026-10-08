/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Page } from "@playwright/test"

const PETSTORE_URL = "/?url=/documents/features/petstore-only-pet.openapi.yaml"
const invalid = /(^|\s)invalid(\s|$)/
const executeButton = ".execute.opblock-control__btn"
const contentTypeSelect =
  ".opblock-section .opblock-section-request-body .body-param-content-type > select"
const bodyTextarea = (page: Page) =>
  page.locator(
    ".opblock-body .opblock-section .opblock-section-request-body .body-param textarea"
  )
const paramInput = (page: Page, nth: number) =>
  page.locator(
    `.opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(${nth}) > .parameters-col_description input`
  )
const curlCommand = (page: Page) =>
  page.locator(".responses-wrapper .curl-command")

test.describe("OpenAPI 3.0 Validation for Required Request Body and Request Body Fields", () => {
  test.describe("Request Body required bug/5181", () => {
    test.beforeEach(async ({ page }) => {
      // cy.intercept(POST httpbin.org/anything/foos, {}): stub with an empty JSON body
      await page.route("**://httpbin.org/anything/foos", async (route) => {
        if (route.request().method() !== "POST") {
          await route.fallback()
          return
        }
        await route.fulfill({ status: 200, json: {} })
      })
    })

    test("on execute, if empty value, SHOULD render class 'invalid' and should NOT render cURL component", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/5181.yaml")
      await swaggerUi.toggleOperation("#operations-default-post_foos")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      // get input
      await paramInput(page, 1).fill("")
      await expect(paramInput(page, 1)).not.toHaveClass(invalid)
      // Execute
      await page.locator(executeButton).click()
      // class "invalid" should now exist (and render red, which we won't check)
      await expect(paramInput(page, 1)).toHaveClass(invalid)
      // cURL component should not exist
      await expect(curlCommand(page)).toHaveCount(0)
    })
    test("on execute, if value exists, should NOT render class 'invalid' and SHOULD render cURL component", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/bugs/5181.yaml")
      await swaggerUi.toggleOperation("#operations-default-post_foos")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      // get input
      await paramInput(page, 1).pressSequentially("abc")
      // Execute
      await page.locator(executeButton).click()
      await expect(paramInput(page, 1)).not.toHaveClass(invalid)
      // cURL component should exist
      await expect(curlCommand(page)).toBeAttached()
    })
  })

  test.describe("Request Body required fields - application/json", () => {
    test("on execute, if empty value, SHOULD render class 'invalid' and should NOT render cURL component", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(PETSTORE_URL)
      await swaggerUi.toggleOperation("#operations-pet-addPet")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      // get and clear textarea
      await expect(bodyTextarea(page)).not.toHaveClass(invalid)
      await bodyTextarea(page).fill("")
      // Execute
      await page.locator(executeButton).click()
      // class "invalid" should now exist (and render red, which we won't check)
      await expect(bodyTextarea(page)).toHaveClass(invalid)
      // cURL component should not exist
      await expect(curlCommand(page)).toHaveCount(0)
    })
    test("on execute, if value exists, even if just single space, should NOT render class 'invalid' and SHOULD render cURL component that contains the single space", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(PETSTORE_URL)
      await swaggerUi.toggleOperation("#operations-pet-addPet")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      // get, clear, then modify textarea
      await bodyTextarea(page).fill("")
      await bodyTextarea(page).pressSequentially(" ")
      // Execute
      await page.locator(executeButton).click()
      await expect(bodyTextarea(page)).not.toHaveClass(invalid)
      // cURL component should exist
      await expect(curlCommand(page)).toBeAttached()
      // jQuery `.text()` over `.curl-command span` concatenates every span's text
      await expect
        .poll(() =>
          page
            .locator(".responses-wrapper .curl-command span")
            .allTextContents()
            .then((texts) => texts.join(""))
        )
        .toContain("' '")
    })
  })

  /*
  petstore ux notes:
  - required field, but if example value exists, will populate the field. So this test will clear the example value.
  - "add item" will insert an empty array, and display an input text box. This establishes a value for the field.
  */
  test.describe("Request Body required fields - application/x-www-form-urlencoded", () => {
    test("on execute, if empty value, SHOULD render class 'invalid' and should NOT render cURL component", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(PETSTORE_URL)
      await swaggerUi.toggleOperation("#operations-pet-addPet")
      await page
        .locator(contentTypeSelect)
        .selectOption("application/x-www-form-urlencoded")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      // get and clear input populated from example value
      await paramInput(page, 2).fill("")
      // Execute
      await page.locator(executeButton).click()
      // class "invalid" should now exist (and render red, which we won't check)
      await expect(paramInput(page, 2)).toHaveClass(invalid)
      // cURL component should not exist
      await expect(curlCommand(page)).toHaveCount(0)
    })
    test("on execute, if all values exist, even if array exists but is empty, should NOT render class 'invalid' and SHOULD render cURL component", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(PETSTORE_URL)
      await swaggerUi.toggleOperation("#operations-pet-addPet")
      await page
        .locator(contentTypeSelect)
        .selectOption("application/x-www-form-urlencoded")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      // Execute
      await page.locator(executeButton).click()
      await expect(paramInput(page, 2)).toHaveValue("doggie")
      await expect(paramInput(page, 2)).not.toHaveClass(invalid)
      await expect(paramInput(page, 4)).toHaveValue("string")
      await expect(paramInput(page, 4)).not.toHaveClass(invalid)
      // cURL component should exist
      await expect(curlCommand(page)).toBeAttached()
    })
  })

  test.describe("Request Body: switching between Content Types", () => {
    test("after application/json 'invalid' error, on switch content type to application/x-www-form-urlencoded, SHOULD be free of errors", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(PETSTORE_URL)
      await swaggerUi.toggleOperation("#operations-pet-addPet")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      // get and clear textarea
      await expect(bodyTextarea(page)).not.toHaveClass(invalid)
      await bodyTextarea(page).fill("")
      // Execute
      await page.locator(executeButton).click()
      await expect(bodyTextarea(page)).toHaveClass(invalid)
      // switch content type
      await page
        .locator(contentTypeSelect)
        .selectOption("application/x-www-form-urlencoded")
      await expect(paramInput(page, 2)).not.toHaveClass(invalid)
    })
    test("after application/x-www-form-urlencoded 'invalid' error, on switch content type to application/json, SHOULD be free of errors", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(PETSTORE_URL)
      await swaggerUi.toggleOperation("#operations-pet-addPet")
      await page
        .locator(contentTypeSelect)
        .selectOption("application/x-www-form-urlencoded")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      // get and clear input
      await paramInput(page, 2).fill("")
      // Execute
      await page.locator(executeButton).click()
      // class "invalid" should now exist (and render red, which we won't check)
      await expect(paramInput(page, 2)).toHaveClass(invalid)
      // switch content type
      await page.locator(contentTypeSelect).selectOption("application/json")
      await expect(bodyTextarea(page)).not.toHaveClass(invalid)
    })
  })
})
