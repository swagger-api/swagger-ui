/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

const selectedMediaType =
  "label > .content-type-wrapper > .content-type option:checked"
const mediaTypeSelect = "label > .content-type-wrapper > .content-type"

test.describe("XML schema rendering examples", () => {
  test("Should render RequestBody example value when schema contains `oneOf` for mediaType `text/xml`", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_foo")
    await expect(page.locator(selectedMediaType)).toHaveText("text/xml")
    await expect(page.locator(".body-param__example")).toContainText("<fooOne>")
  })
  test("Should render RequestBody example value when schema contains `anyOf` for mediaType `text/xml`", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_bar")
    await expect(page.locator(selectedMediaType)).toHaveText("text/xml")
    await expect(page.locator(".body-param__example")).toContainText("<fooOne>")
  })
  test("Should render RequestBody example value when schema contains `oneOf` for mediaType `application/xml`", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_foobar")
    await expect(page.locator(selectedMediaType)).toHaveText("application/xml")
    await expect(page.locator(".body-param__example")).toContainText("<fooOne>")
  })
  test("Should render RequestBody example value when schema contains `anyOf` for mediaType `application/xml`", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_barfoo")
    await expect(page.locator(selectedMediaType)).toHaveText("application/xml")
    await expect(page.locator(".body-param__example")).toContainText("<fooOne>")
  })
  test("Should render RequestBody example value when switching mediaType to `text/xml` with singular content schema", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_barfoo")
    await page.locator(mediaTypeSelect).selectOption("text/xml")
    await expect(page.locator(".body-param__example")).toContainText(
      "<fooThree>"
    )
  })
  test("Should render RequestBody example value when switching mediaType to `application/xml` with singular content schema", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_foo")
    await page.locator(mediaTypeSelect).selectOption("application/xml")
    await expect(page.locator(".body-param__example")).toContainText("<fooTwo>")
  })
  test("Should render Response example value for mediaType `application/xml`", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_foo")
    await expect(
      page.locator(".response-col_description > .model-example")
    ).toContainText("<foobarResObj>")
  })
  test("Should render Response example value for mediaType `text/xml`", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_foobar")
    await expect(
      page.locator(".response-col_description > .model-example")
    ).toContainText("<foobarResObj>")
  })
})
