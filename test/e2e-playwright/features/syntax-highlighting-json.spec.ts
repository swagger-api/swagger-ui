/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Syntax Highlighting for JSON value cases", () => {
  // expect span contains entire string sample
  // fail case is if the string sample gets broken up into segments
  // due react-syntax-highlighter attempting to escape characters into multiple segments
  test.describe("OAS 2", () => {
    test("should render full syntax highlighted string in Request (param body) example", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(
        "/?url=/documents/features/syntax-highlighting-json-oas2.yaml"
      )
      await swaggerUi.toggleOperation("#operations-default-post_setServices")
      await expect(
        page.locator(".body-param__example > .language-json > :nth-child(10)")
      ).toHaveText('"79daf5b4-aa4b-1452-eae5-42c231477ba7"')
    })
    test("should render full syntax highlighted string in Response example", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(
        "/?url=/documents/features/syntax-highlighting-json-oas2.yaml"
      )
      await swaggerUi.toggleOperation("#operations-default-post_setServices")
      await expect(
        page.locator(".example > .language-json > :nth-child(28)")
      ).toHaveText('"5ff06f632bb165394501b05d3a833355"')
    })
  })
  test.describe("OAS 3", () => {
    test("should render full syntax highlighted string in Request example", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(
        "/?url=/documents/features/syntax-highlighting-json-oas3.yaml"
      )
      await swaggerUi.toggleOperation("#operations-default-post_setServices")
      await expect(
        page.locator(".body-param__example > .language-json > :nth-child(15)")
      ).toHaveText('"22a124b4-594b-4452-bdf5-fc3ef1477ba7"')
    })
    test("should render full syntax highlighted string in Response example", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(
        "/?url=/documents/features/syntax-highlighting-json-oas3.yaml"
      )
      await swaggerUi.toggleOperation("#operations-default-post_setServices")
      await expect(
        page.locator(".example > .language-json > :nth-child(33)")
      ).toHaveText('"f0009babde9dbe204540d79cf754408e"')
    })
  })
})
