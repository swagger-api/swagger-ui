/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Page } from "@playwright/test"
import {
  ParameterPrimitiveTestCases,
  RequestBodyPrimitiveTestCases,
  ResponsePrimitiveTestCases,
} from "../support/multiple-examples"

const SPEC_URL = "/?url=/documents/features/multiple-examples-core.openapi.yaml"
const selectedOf = (page: Page, selectSelector: string) =>
  page.locator(`${selectSelector} option:checked`)
// Cypress `.then(inputs => expect(values).to.deep.equal(...))` -> retrying poll.
const inputValues = (page: Page, selector: string) => () =>
  page
    .locator(selector)
    .evaluateAll((els) => els.map((el) => (el as HTMLInputElement).value))
// Cypress `.type()` puts the caret at the end of the field; mirror that for textareas.
const focusAtEnd = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => {
    const textarea = el as HTMLTextAreaElement
    textarea.focus()
    textarea.setSelectionRange(textarea.value.length, textarea.value.length)
  })
test.describe("OpenAPI 3.0 Multiple Examples - core features", () => {
  test.describe("/String", () => {
    test.describe("in a parameter", () => {
      ParameterPrimitiveTestCases({
        operationDomId: "#operations-default-post_String",
        parameterName: "message",
        exampleA: {
          key: "StringExampleA",
          value: "hello world",
        },
        exampleB: {
          key: "StringExampleB",
          value: "The quick brown fox jumps over the lazy dog",
        },
        customUserInput: "OpenAPIs.org <3",
      })
    })
    test.describe("in a Request Body", () => {
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_String",
        exampleA: {
          key: "StringExampleA",
          value: "hello world",
          serializedValue: "hello world",
          summary: "Don't just string me along...",
        },
        exampleB: {
          key: "StringExampleB",
          value: "The quick brown fox jumps over the lazy dog",
          serializedValue: "The quick brown fox jumps over the lazy dog",
          summary: "I'm a pangram!",
        },
        customUserInput: "OpenAPIs.org <3",
      })
    })
    test.describe("in a Response", () => {
      ResponsePrimitiveTestCases({
        operationDomId: "#operations-default-post_String",
        exampleA: {
          key: "StringExampleA",
          value: "hello world",
          summary: "Don't just string me along...",
        },
        exampleB: {
          key: "StringExampleB",
          value: "The quick brown fox jumps over the lazy dog",
          summary: "I'm a pangram!",
        },
        exampleC: {
          key: "StringExampleC",
          value: "JavaScript rules",
          summary: "A third example, for use in special places...",
        },
      })
    })
  })
  test.describe("/Number", () => {
    test.describe("in a parameter", () => {
      ParameterPrimitiveTestCases({
        operationDomId: "#operations-default-post_Number",
        parameterName: "message",
        exampleA: {
          key: "NumberExampleA",
          value: "7710263025",
        },
        exampleB: {
          key: "NumberExampleB",
          value: "9007199254740991",
        },
        exampleC: {
          key: "NumberExampleC",
          value: "0",
        },
        customUserInput: "9001",
      })
    })
    test.describe("in a Request Body", () => {
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_Number",
        exampleA: {
          key: "NumberExampleA",
          value: "7710263025",
          summary: "World population",
        },
        exampleB: {
          key: "NumberExampleB",
          value: "9007199254740991",
          summary: "Number.MAX_SAFE_INTEGER",
        },
        exampleC: {
          key: "NumberExampleC",
          value: "0",
        },
        customUserInput: "1337",
      })
    })
    test.describe("in a Response", () => {
      ResponsePrimitiveTestCases({
        operationDomId: "#operations-default-post_Number",
        exampleA: {
          key: "NumberExampleA",
          value: "7710263025",
          summary: "World population",
        },
        exampleB: {
          key: "NumberExampleB",
          value: "9007199254740991",
          summary: "Number.MAX_SAFE_INTEGER",
        },
        exampleC: {
          key: "NumberExampleC",
          value: "0",
        },
      })
    })
  })
  test.describe("/Boolean", () => {
    test.describe("in a parameter", () => {
      test("should render and apply the first example and value by default", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Boolean")
        // Assert on the initial dropdown value
        await expect(
          selectedOf(page, "table.parameters .examples-select > select")
        ).toHaveText("The truth will set you free")
        // Assert on the initial JsonSchemaForm value
        await expect(
          page.locator(".parameters-col_description > select")
        ).toHaveAttribute("disabled")
        await expect(
          selectedOf(page, ".parameters-col_description > select")
        ).toHaveText("true")
        // Execute
        await swaggerUi.tryItOut()
        await swaggerUi.execute()
        // Assert on the request URL
        await expect(page.locator(".request-url")).toContainText(
          `?message=true`
        )
      })
      test("should render and apply the second value when chosen", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Boolean")
        // Set the dropdown value, then assert on it
        await page
          .locator("table.parameters .examples-select > select")
          .selectOption("BooleanExampleB")
        await expect(
          selectedOf(page, "table.parameters .examples-select > select")
        ).toHaveText("Friends don't lie to friends")
        // Set the JsonSchemaForm value, then assert on it
        await expect(
          selectedOf(page, ".parameters-col_description > select")
        ).toHaveText("false")
        // Execute
        await swaggerUi.tryItOut()
        await swaggerUi.execute()
        // Assert on the request URL
        await expect(page.locator(".request-url")).toContainText(
          `?message=false`
        )
      })
      test("should track value changes against valid examples", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Boolean")
        await swaggerUi.tryItOut()
        // Set the JsonSchemaForm value, then assert on it
        await page
          .locator(".parameters-col_description > select")
          .selectOption("false")
        await expect(
          selectedOf(page, ".parameters-col_description > select")
        ).toHaveText("false")
        // Assert on the dropdown value
        await expect(
          selectedOf(page, "table.parameters .examples-select > select")
        ).toHaveText("Friends don't lie to friends")
        // Execute
        await swaggerUi.execute()
        // Assert on the request URL
        await expect(page.locator(".request-url")).toContainText(
          `?message=false`
        )
      })
    })
    test.describe("in a Request Body", () => {
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_Boolean",
        exampleA: {
          key: "BooleanExampleA",
          value: "true",
          summary: "The truth will set you free",
        },
        exampleB: {
          key: "BooleanExampleB",
          value: "false",
          summary: "Friends don't lie to friends",
        },
        customUserInput: "tralse",
      })
    })
    test.describe("in a Response", () => {
      test("should render and apply the first example and value by default", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Boolean")
        // Assert on the initial dropdown value
        await expect(
          selectedOf(page, ".responses-wrapper .examples-select > select")
        ).toHaveText("The truth will set you free")
        // Assert on the example value
        await expect(page.locator(".example.microlight")).toHaveText("true")
      })
      test("should render and apply the second value when chosen", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Boolean")
        // Set the dropdown value, then assert on it
        await page
          .locator(".responses-wrapper .examples-select > select")
          .selectOption("BooleanExampleB")
        await expect(
          selectedOf(page, ".responses-wrapper .examples-select > select")
        ).toHaveText("Friends don't lie to friends")
        // Assert on the example value
        await expect(page.locator(".example.microlight")).toHaveText("false")
      })
    })
  })
  test.describe("/Array", () => {
    test.describe("in a Parameter", () => {
      const arrayInputs = ".json-schema-form-item > input"
      const arraySelect =
        ".parameters-col_description .examples-select > select"

      test("should have the first example's array entries by default", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        await expect
          .poll(inputValues(page, arrayInputs))
          .toEqual(["a", "b", "c"])
        await expect(selectedOf(page, arraySelect)).toHaveText(
          "A lowly array of strings"
        )
      })
      test("should switch to the second array's entries via dropdown", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        await page.locator(arraySelect).selectOption("ArrayExampleB")
        await expect
          .poll(inputValues(page, arrayInputs))
          .toEqual(["1", "2", "3", "4"])
        await expect(selectedOf(page, arraySelect)).toHaveText(
          "A lowly array of numbers"
        )
      })
      test("should not allow modification of values in static mode", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        await page.locator(arraySelect).selectOption("ArrayExampleB")
        // Cypress asserted `disabled` on the first input of the set only; check every input
        await expect(page.locator(arrayInputs)).toHaveCount(4)
        for (const input of await page.locator(arrayInputs).all()) {
          await expect(input).toHaveAttribute("disabled")
        }
      })
      test("should allow modification of values in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        await swaggerUi.tryItOut()
        await page.locator(arraySelect).selectOption("ArrayExampleB")
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        // `{selectall}5` -> fill("5")
        await page
          .locator(".json-schema-form-item:last-of-type > input")
          .fill("5")
        // Assert against the input fields
        await expect
          .poll(inputValues(page, arrayInputs))
          .toEqual(["1", "2", "3", "4", "5"])
        await expect(selectedOf(page, arraySelect)).toHaveText(
          "[Modified value]"
        )
      })

      test("should retain a modified value, and support returning to it", async ({
        page,
        swaggerUi,
      }) => {
        // fake clock (time still flows) so the input debounce can be flushed below
        await page.clock.install()
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        await swaggerUi.tryItOut()
        await page.locator(arraySelect).selectOption("ArrayExampleB")
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        await page
          .locator(".json-schema-form-item:last-of-type > input")
          .fill("5")
        // Array item inputs are 350ms-debounced (react-debounce-input) and the
        // DOM exposes no signal when the edit lands in state; Cypress's command
        // latency hid that race. Flush the debounce deterministically instead of sleeping.
        await page.clock.runFor(350)
        await expect(selectedOf(page, arraySelect)).toHaveText(
          "[Modified value]"
        )
        // Reset to an example
        await page.locator(arraySelect).selectOption("ArrayExampleB")
        // Assert against the input fields
        await expect
          .poll(inputValues(page, arrayInputs))
          .toEqual(["1", "2", "3", "4"])
        await expect(selectedOf(page, arraySelect)).toHaveText(
          "A lowly array of numbers"
        )
        // Return to the modified value
        await page.locator(arraySelect).selectOption("__MODIFIED__VALUE__")
        // Assert that our modified value is back
        await expect
          .poll(inputValues(page, arrayInputs))
          .toEqual(["1", "2", "3", "4", "5"])
        await expect(selectedOf(page, arraySelect)).toHaveText(
          "[Modified value]"
        )
      })
    })
    test.describe("in a Request Body", () => {
      const rb = ".opblock-section-request-body"
      const rbSelect = `${rb} .examples-select > select`
      const rbTextarea = `${rb} textarea`
      // `.type("{leftarrow}{leftarrow},{enter}  5")`, caret starting at the end of the textarea
      const appendFive = async (page: Page) => {
        await focusAtEnd(page, rbTextarea)
        await page.locator(rbTextarea).press("ArrowLeft")
        await page.locator(rbTextarea).press("ArrowLeft")
        await page.locator(rbTextarea).pressSequentially(",")
        await page.locator(rbTextarea).press("Enter")
        await page.locator(rbTextarea).pressSequentially("  5")
      }

      test("should have the first example's array entries by default", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        // Check HighlightCode value
        await expect(page.locator(`${rb} .highlight-code`)).toContainText(
          JSON.stringify(["a", "b", "c"], null, 2)
        )
        // Check dropdown value
        await expect(selectedOf(page, rbSelect)).toHaveText(
          "A lowly array of strings"
        )
        // Switch to Try-It-Out
        await swaggerUi.tryItOut()
        // Check textarea value
        await expect(page.locator(rbTextarea)).toHaveValue(
          JSON.stringify(["a", "b", "c"], null, 2)
        )
        // Check dropdown value
        await expect(selectedOf(page, rbSelect)).toHaveText(
          "A lowly array of strings"
        )
      })
      test("should switch to the second array's entries via dropdown", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        await page.locator(rbSelect).selectOption("ArrayExampleB")
        await expect(page.locator(`${rb} .highlight-code`)).toContainText(
          JSON.stringify([1, 2, 3, 4], null, 2)
        )
        await expect(selectedOf(page, rbSelect)).toHaveText(
          "A lowly array of numbers"
        )
        // Switch to Try-It-Out
        await swaggerUi.tryItOut()
        // Check textarea value
        await expect(page.locator(rbTextarea)).toContainText(
          JSON.stringify([1, 2, 3, 4], null, 2)
        )
        // Check dropdown value
        await expect(selectedOf(page, rbSelect)).toHaveText(
          "A lowly array of numbers"
        )
      })
      test("should allow modification of values", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        // Switch to Try-It-Out
        await swaggerUi.tryItOut()
        // Choose the second example
        await page.locator(rbSelect).selectOption("ArrayExampleB")
        // Change the value
        await appendFive(page)
        // Check that [Modified value] is displayed in dropdown
        await expect(selectedOf(page, rbSelect)).toHaveText("[Modified value]")
        // Check textarea value
        await expect(page.locator(rbTextarea)).toContainText(
          JSON.stringify([1, 2, 3, 4, 5], null, 2)
        )
      })

      test("should retain a modified value, and support returning to it", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        // Switch to Try-It-Out
        await swaggerUi.tryItOut()
        // Choose the second example as the example to start with
        await page.locator(rbSelect).selectOption("ArrayExampleB")
        // Change the value
        await appendFive(page)
        // Check that [Modified value] is displayed in dropdown
        await expect(selectedOf(page, rbSelect)).toHaveText("[Modified value]")
        // Check textarea value
        await expect(page.locator(rbTextarea)).toContainText(
          JSON.stringify([1, 2, 3, 4, 5], null, 2)
        )
        // Choose the second example
        await page.locator(rbSelect).selectOption("ArrayExampleB")
        // Check that the example is displayed in dropdown
        await expect(selectedOf(page, rbSelect)).toHaveText(
          "A lowly array of numbers"
        )
        // Check textarea value
        await expect(page.locator(rbTextarea)).toContainText(
          JSON.stringify([1, 2, 3, 4], null, 2)
        )
        // Switch back to the modified value
        await page.locator(rbSelect).selectOption("__MODIFIED__VALUE__")
        // Check textarea value
        await expect(page.locator(rbTextarea)).toContainText(
          JSON.stringify([1, 2, 3, 4, 5], null, 2)
        )
      })
    })
    test.describe("in a Response", () => {
      const respSelect = ".responses-wrapper .examples-select > select"

      test("should render and apply the first example and value by default", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        // Assert on the initial dropdown value
        await expect(selectedOf(page, respSelect)).toHaveText(
          "A lowly array of strings"
        )
        // Assert on the example value
        await expect(page.locator(".example.microlight")).toContainText(
          JSON.stringify(["a", "b", "c"], null, 2)
        )
      })
      test("should render and apply the second value when chosen", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        // Set the dropdown value, then assert on it
        await page.locator(respSelect).selectOption("ArrayExampleB")
        await expect(selectedOf(page, respSelect)).toHaveText(
          "A lowly array of numbers"
        )
        // Assert on the example value
        await expect(page.locator(".example.microlight")).toContainText(
          JSON.stringify([1, 2, 3, 4], null, 2)
        )
      })
    })
  })
  test.describe("/Object", () => {
    test.describe("in a Parameter", () => {
      ParameterPrimitiveTestCases({
        operationDomId: "#operations-default-post_Object",
        parameterName: "data",
        customUserInput: `{{} "openapiIsCool": true }`,
        customExpectedUrlSubstring: "?openapiIsCool=true",
        exampleA: {
          key: "ObjectExampleA",
          serializedValue:
            "firstName=Kyle&lastName=Shockey&email=kyle.shockey%40smartbear.com",
          value: JSON.stringify(
            {
              firstName: "Kyle",
              lastName: "Shockey",
              email: "kyle.shockey@smartbear.com",
            },
            null,
            2
          ),
        },
        exampleB: {
          key: "ObjectExampleB",
          serializedValue:
            "name=Abbey&type=kitten&color=calico&gender=female&age=11%20weeks",
          value: JSON.stringify(
            {
              name: "Abbey",
              type: "kitten",
              color: "calico",
              gender: "female",
              age: "11 weeks",
            },
            null,
            2
          ),
        },
      })
    })
    test.describe("in a Request Body", () => {
      const exampleA = JSON.stringify(
        {
          firstName: "Kyle",
          lastName: "Shockey",
          email: "kyle.shockey@smartbear.com",
        },
        null,
        2
      )
      const exampleB = JSON.stringify(
        {
          name: "Abbey",
          type: "kitten",
          color: "calico",
          gender: "female",
          age: "11 weeks",
        },
        null,
        2
      )
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_Object",
        primaryMediaType: "application/json",
        // ↓ not a typo, Cypress requires escaping { when using `cy.type`
        customUserInput: `{{} "openapiIsCool": true }`,
        // (Cypress also passed `customExpectedUrlSubstring: "?openapiIsCool=true"` here, but the request-body helper never read it)
        customUserInputExpectedCurlSubstring: `{ "openapiIsCool": true }`,
        exampleA: {
          key: "ObjectExampleA",
          serializedValue: exampleA,
          value: exampleA,
          summary: "A user's contact info",
        },
        exampleB: {
          key: "ObjectExampleB",
          serializedValue: exampleB,
          value: exampleB,
          summary: "A wonderful kitten's info",
        },
      })
      test("should display an error message when input validation fails", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(SPEC_URL)
        // Expand the operation
        await swaggerUi.toggleOperation("#operations-default-post_Object")
        // Switch to Try-It-Out
        await swaggerUi.tryItOut()
        // Set an invalid value (Cypress `{{}` escape is not present here, so the text is typed literally)
        await page
          .locator(
            ".parameters-container > div > table > tbody > tr > td.parameters-col_description > div:nth-child(2) textarea"
          )
          .pressSequentially("{{{{ [[[[ <<<< invalid JSON here.")
        // Execute the operation
        await swaggerUi.execute()
        // Verify that an error is shown
        await expect(page.locator(".validation-errors")).toContainText(
          "Parameter string value must be valid JSON"
        )
      })
    })
    test.describe("in a Response", () => {
      ResponsePrimitiveTestCases({
        operationDomId: "#operations-default-post_Object",
        exampleA: {
          key: "ObjectExampleA",
          value: JSON.stringify(
            {
              firstName: "Kyle",
              lastName: "Shockey",
              email: "kyle.shockey@smartbear.com",
            },
            null,
            2
          ),
          summary: "A user's contact info",
        },
        exampleB: {
          key: "ObjectExampleB",
          value: JSON.stringify(
            {
              name: "Abbey",
              type: "kitten",
              color: "calico",
              gender: "female",
              age: "11 weeks",
            },
            null,
            2
          ),
          summary: "A wonderful kitten's info",
        },
      })
    })
  })
})
