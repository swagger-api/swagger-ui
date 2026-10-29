/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Locator, Page } from "@playwright/test"

const PETSTORE_URL = "/?url=/documents/features/petstore-only-pet.openapi.yaml"

async function getExpandedTryout(
  page: Page,
  url = PETSTORE_URL,
  operationId = "#operations-pet-addPet"
): Promise<void> {
  await page.goto(url)
  await page.locator(operationId).click()
  // Expand Try It Out
  await page.locator(".try-out__btn").click()
}

// get textarea
const requestBodyTextarea = (page: Page) =>
  page.locator(
    ".opblock-body .opblock-section .opblock-section-request-body .body-param textarea"
  )

// Cypress asserted on the raw `textContent` (not whitespace-normalised), so
// poll it instead of using `toHaveText`.
const textContentOf = (textarea: Locator) => () =>
  textarea.evaluate((el) => el.textContent ?? "")

const xmlIndicator = '<?xml version="1.0" encoding="UTF-8"?>\n'
const userEditXmlSample =
  xmlIndicator +
  "<pet>\n" +
  "\t<id>420</id>\n" +
  "\t<name>doggie<3</name>\n" +
  "\t<category>\n" +
  "\t\t<id>99999999999</id>\n" +
  "\t\t<name>Dogiiiiiiiieeee</name>\n" +
  "\t</category>\n" +
  "\t<photoUrls>\n" +
  "\t\t<photoUrl>string</photoUrl>\n" +
  "\t</photoUrls>\n" +
  "\t<tags>\n" +
  "\t\t<tag>\n" +
  "\t\t\t<id>0</id>\n" +
  "\t\t\t<name>string</name>\n" +
  "\t\t</tag>\n" +
  "\t</tags>\n" +
  "\t<status>available</status>\n" +
  "</pet>"

test.describe("OAS3 Request Body user edit flows", () => {
  // Case: Copy xml from email, paste into request body editor, change media-type to xml
  test("it should never overwrite user edited value in case of media-type change", async ({
    page,
  }) => {
    await getExpandedTryout(page)
    // replace default sample with xml edited value (`{selectall}` + text -> fill)
    await requestBodyTextarea(page).fill(userEditXmlSample)
    // change media type to xml, because I have forgotten it
    await page
      .locator(
        ".opblock-section .opblock-section-request-body .body-param-content-type > select"
      )
      .selectOption("application/xml")
    // Ensure user edited body is not overwritten
    await expect
      .poll(
        textContentOf(
          page.locator(".opblock-section-request-body").locator("textarea")
        )
      )
      .toBe(userEditXmlSample)
  })
  // Case: User really wants to try out the brand new xml content-type
  test("it should overwrite default value in case of content-type change, even within request body editor(#6836)", async ({
    page,
  }) => {
    await getExpandedTryout(page)
    // change media type to xml, because I have forgotten it (sry really wanted to try out the new xml content-type)
    await page
      .locator(
        ".opblock-section .opblock-section-request-body .body-param-content-type > select"
      )
      .selectOption("application/xml")
    // Ensure default value is xml after content type change
    await expect
      .poll(
        textContentOf(
          page.locator(".opblock-section-request-body").locator("textarea")
        )
      )
      .toContain(xmlIndicator)
  })
  // Case: User wants to get the default value back
  test("it reset the user edited value and render the default value in case of try out reset. (#6517)", async ({
    page,
  }) => {
    await getExpandedTryout(page)
    // replace default sample with bad value
    await requestBodyTextarea(page).fill("ups that should not have happened")
    // Cancel Try It Out
    await page.locator(".try-out__btn.reset").click()
    // Ensure default value is xml after content type change
    await expect
      .poll(
        textContentOf(
          page.locator(".opblock-section-request-body").locator("textarea")
        )
      )
      .not.toContain("ups that should not have happened")
  })
  test.describe("multipart/", () => {
    // Case: User wants to execute operation with media-type multipart/ with a enum property. The user expects the first enum value to be used when executed.
    test("should use the first enum value on execute if not changed by user (#6976)", async ({
      page,
    }) => {
      // test/e2e-playwright/static/documents/features/request-body/multipart/enum.yaml
      await getExpandedTryout(
        page,
        "/?url=/documents/features/request-body/multipart/enum.yaml",
        "#operations-default-post_test"
      )
      await page.locator(".execute").click()
      // Assert on the request URL
      await expect(page.locator(".curl")).toContainText("test_enum=A")
    })
  })
})
