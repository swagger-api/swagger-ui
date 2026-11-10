/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#6540: XML example not rendered correctly with oneOf", () => {
  test("should render xml like json", async ({ page, swaggerUi }) => {
    const expected =
      '<?xml version="1.0" encoding="UTF-8"?>\n<test>\n\t<a>string</a>\n\t<b>0</b>\n\t<c>\n\t\t<ObjectType>Text</ObjectType>\n\t\t<Data>This is a text</Data>\n\t</c>\n\t<c>\n\t\t<ObjectType>image</ObjectType>\n\t\t<Data>This is a image</Data>\n\t</c>\n\t<d>\n\t\t<ObjectType>Text</ObjectType>\n\t\t<Data>This is a text</Data>\n\t</d>\n\t<d>\n\t\t<ObjectType>image</ObjectType>\n\t\t<Data>This is a image</Data>\n\t</d>\n</test>'
    await page.goto("/?url=/documents/bugs/6540.yaml")
    await swaggerUi.toggleOperation("#operations-Test-postTest")
    // toContainText normalizes whitespace like cy.contains
    await expect(page.locator(".microlight")).toContainText(expected)
  })
})
