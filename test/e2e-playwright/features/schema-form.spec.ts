/**
 * @prettier
 */
import type { Page } from "@playwright/test"
import { test, expect } from "../support/fixtures"
import type { SwaggerUi } from "../support/fixtures"

const missingValuesUrl =
  "/?url=/documents/features/schema-form-missing-values.yaml"
const examplesUrl =
  "/?url=/documents/features/multiple-examples-core.openapi.yaml"
const coreUrl = "/?url=/documents/features/schema-form-core.yaml"

const executeButton = (page: Page) =>
  page.locator(".execute.opblock-control__btn")
const clearButton = (page: Page) =>
  page.locator(".btn-clear.opblock-control__btn")
const requestUrl = (page: Page) => page.locator(".request-url pre.microlight")
const arrayItemInputs = (page: Page) =>
  page.locator(".json-schema-form-item > input")
const lastArrayItemInput = (page: Page) =>
  page.locator(".json-schema-form-item:last-of-type > input")
// Cypress `.then((inputs) => expect(inputs.map(el.value)).to.deep.equal(...))`,
// polled instead of read once so it waits for React to re-render.
const expectInputValues = (page: Page, values: string[]) =>
  expect
    .poll(() =>
      arrayItemInputs(page).evaluateAll((inputs) =>
        inputs.map((input) => (input as HTMLInputElement).value)
      )
    )
    .toEqual(values)

test.describe("OpenAPI 3.0 Additional JsonSchemaForm in a Parameter", () => {
  test.describe("incomplete API definition with missing schema key or schema value(s)", () => {
    test.describe("parameter exists as global", () => {
      test("should render when parameter exists as global, but missing schema key", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(missingValuesUrl)
        await swaggerUi.toggleOperation(
          "#operations-default-get_case_one_no_schema"
        )
        await expect(
          page.locator(".opblock-description .renderedMarkdown p")
        ).toHaveText("sf")
      })
      test("should render when parameter exists as global, but missing all schema values", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(missingValuesUrl)
        await swaggerUi.toggleOperation(
          "#operations-default-get_case_one_no_type_or_format"
        )
        await expect(
          page.locator(".opblock-description .renderedMarkdown p")
        ).toHaveText("sf")
      })
      test("should render when parameter exists as global, schema key exists, but missing schema values: format", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(missingValuesUrl)
        await swaggerUi.toggleOperation(
          "#operations-default-get_case_one_format_only_no_type"
        )
        await expect(
          page.locator(".opblock-description .renderedMarkdown p")
        ).toHaveText("sf")
      })
      test("should render when parameter exists as global, schema key exists, but missing schema value: type", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(missingValuesUrl)
        await swaggerUi.toggleOperation(
          "#operations-default-get_case_one_type_only_no_format"
        )
        await expect(
          page.locator(".opblock-description .renderedMarkdown p")
        ).toHaveText("sf")
      })
    })
    test.describe("parameter exists in method", () => {
      test("should render when parameter exists in method, but missing schema key", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(missingValuesUrl)
        await swaggerUi.toggleOperation(
          "#operations-default-get_case_two_no_schema"
        )
        await expect(
          page.locator(".opblock-description .renderedMarkdown p")
        ).toHaveText("sf")
      })
      test("should render when parameter exists in method, schema key exists, but missing all schema values", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(missingValuesUrl)
        await swaggerUi.toggleOperation(
          "#operations-default-get_case_two_no_type_or_format"
        )
        await expect(
          page.locator(".opblock-description .renderedMarkdown p")
        ).toHaveText("sf")
      })
      test("should render when parameter exists in method, schema key exists, but missing schema value: format", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(missingValuesUrl)
        await swaggerUi.toggleOperation(
          "#operations-default-get_case_one_type_only_no_format"
        )
        await expect(
          page.locator(".opblock-description .renderedMarkdown p")
        ).toHaveText("sf")
      })
      test("should render when parameter exists in method, schema key exists, but missing schema value: type", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(missingValuesUrl)
        await swaggerUi.toggleOperation(
          "#operations-default-get_case_one_format_only_no_type"
        )
        await expect(
          page.locator(".opblock-description .renderedMarkdown p")
        ).toHaveText("sf")
      })
    })
  })
  test.describe("/Array", () => {
    test.describe("in a Parameter", () => {
      // shared steps: open /Array, enable Try it out, pick ArrayExampleB
      const openArrayWithExampleB = async (
        page: Page,
        swaggerUi: SwaggerUi
      ) => {
        await page.goto(examplesUrl)
        await swaggerUi.toggleOperation("#operations-default-post_Array")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        await page
          .locator(".parameters-col_description .examples-select > select")
          .selectOption("ArrayExampleB")
      }
      const addItemAndTypeFive = async (page: Page) => {
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        // `{selectall}5` replaces the content
        await lastArrayItemInput(page).fill("5")
        // Assert against the input fields
        await expectInputValues(page, ["1", "2", "3", "4", "5"])
        await expect(
          page
            .locator(".parameters-col_description .examples-select > select")
            .locator("option:checked")
        ).toHaveText("[Modified value]")
      }

      test("should allow modification of values in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await openArrayWithExampleB(page, swaggerUi)
        await addItemAndTypeFive(page)
      })
      test("should allow removal of added value in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await openArrayWithExampleB(page, swaggerUi)
        await addItemAndTypeFive(page)
        // Remove the last item that was just added
        await page
          .locator(
            ".json-schema-form-item:last-of-type > .json-schema-form-item-remove"
          )
          .click()
        await expectInputValues(page, ["1", "2", "3", "4"])
      })
      test("should allow removal of nth of values in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await openArrayWithExampleB(page, swaggerUi)
        await addItemAndTypeFive(page)
        // Remove the second item in list
        await page
          .locator(
            ".json-schema-form-item:nth-child(2) > .json-schema-form-item-remove"
          )
          .click()
        await expectInputValues(page, ["1", "3", "4", "5"])
      })
      test("should allow execution of operation in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await openArrayWithExampleB(page, swaggerUi)
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
      })
      test("should add empty item and allow execution of operation in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await openArrayWithExampleB(page, swaggerUi)
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        // Execute without prior typing a value
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
      })
    })
  })
  test.describe("Petstore", () => {
    test.describe("/pet/findByStatus", () => {
      test("should render the operation, execute with default value", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-default-findPetsByStatus")
        // Expand operation
        await expect(page.locator(".opblock-title span")).toHaveText(
          "Parameters"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("available")
      })
      test("should render the operation, modify value, and execute with modified value", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-default-findPetsByStatus")
        // Expand operation
        await expect(page.locator(".opblock-title span")).toHaveText(
          "Parameters"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Select
        await page
          .locator(".parameters-col_description > select")
          .selectOption("pending")
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("pending")
      })
    })
    test.describe("/pet/findByTags", () => {
      test("should allow modification of values in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-pet-findPetsByTags")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        await arrayItemInputs(page).fill("spotted")
        await arrayItemInputs(page).blur()
        // Assert against the input fields
        await expectInputValues(page, ["spotted"])
      })
      test("should allow removal of added value in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-pet-findPetsByTags")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        await lastArrayItemInput(page).fill("spotted")
        await lastArrayItemInput(page).blur()
        // Assert against the input fields
        await expectInputValues(page, ["spotted"])
        // Remove the last item that was just added
        await page
          .locator(
            ".json-schema-form-item:last-of-type > .json-schema-form-item-remove"
          )
          .click()
        await expect(arrayItemInputs(page)).toHaveCount(0)
      })
      test("should allow removal of nth of values in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-pet-findPetsByTags")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        await lastArrayItemInput(page).fill("spotted")
        await lastArrayItemInput(page).blur()
        // Assert against the input fields
        await expectInputValues(page, ["spotted"])
        // Add a 2nd new item
        await page.locator(".json-schema-form-item-add").click()
        await lastArrayItemInput(page).fill("large")
        // Assert against the input fields
        await expectInputValues(page, ["spotted", "large"])
        // Add a 3rd new item
        await page.locator(".json-schema-form-item-add").click()
        await lastArrayItemInput(page).fill("puppy")
        // Assert against the input fields
        await expectInputValues(page, ["spotted", "large", "puppy"])
        // Remove the second item in list
        await page
          .locator(
            ".json-schema-form-item:nth-child(2) > .json-schema-form-item-remove"
          )
          .click()
        await expectInputValues(page, ["spotted", "puppy"])
      })
      test("should allow execution of operation without modifications in Try-It-Out (debounce)", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-pet-findPetsByTags")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("findByTags")
      })
      test("should add empty item and allow execution of operation in Try-It-Out (debounce)", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-pet-findPetsByTags")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        // Execute without prior typing a value
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("findByTags")
      })
      test("should add modified item and allow execution of operation in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-pet-findPetsByTags")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        await arrayItemInputs(page).fill("spotted")
        await arrayItemInputs(page).blur()
        // Assert against the input fields
        await expectInputValues(page, ["spotted"])
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("spotted")
      })
      test("should add 3 modified items, remove the middle child, and allow execution of operation Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-pet-findPetsByTags")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Add a new item
        await page.locator(".json-schema-form-item-add").click()
        await lastArrayItemInput(page).fill("spotted")
        await lastArrayItemInput(page).blur()
        // Assert against the input fields
        await expectInputValues(page, ["spotted"])
        // Add a 2nd new item
        await page.locator(".json-schema-form-item-add").click()
        await lastArrayItemInput(page).fill("large")
        // Assert against the input fields
        await expectInputValues(page, ["spotted", "large"])
        // Add a 3rd new item
        await page.locator(".json-schema-form-item-add").click()
        await lastArrayItemInput(page).fill("puppy")
        // Assert against the input fields
        await expectInputValues(page, ["spotted", "large", "puppy"])
        // Remove the second item in list
        await page
          .locator(
            ".json-schema-form-item:nth-child(2) > .json-schema-form-item-remove"
          )
          .click()
        await expectInputValues(page, ["spotted", "puppy"])
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("tags=spotted&tags=puppy")
        // (literal port: Cypress `not.have.text` compares the full text)
        await expect(requestUrl(page)).not.toHaveText("large")
      })
    })
    test.describe("/petOwner/{petOwnerId}", () => {
      // This is a (GET) debounce test for schema type: string
      test("should render the operation, and allow execute of operation with empty value (debounce)", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-petOwner-getPetOwnerById")
        // Expand operation
        await expect(page.locator(".opblock-title span")).toHaveText(
          "Parameters"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("petOwner")
      })
      test("should render the operation, and input field, and allow execute of operation", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-petOwner-getPetOwnerById")
        // Expand operation
        await expect(page.locator(".opblock-title span")).toHaveText(
          "Parameters"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // plain `.type("123")` (no special sequences): real key presses
        await page
          .locator(".parameters-col_description > input")
          .pressSequentially("123")
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("petOwner")
        await expect(requestUrl(page)).toContainText("123")
      })
    })
    test.describe("/petOwner/listOfServiceTrainer", () => {
      test("should allow execution of operation with value=true in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation(
          "#operations-petOwner-listOfServiceTrainer"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // add 1st item
        await page.locator(".json-schema-form-item-add").click()
        await page
          .locator(".json-schema-form-item > select")
          .selectOption("true")
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("tags=true")
      })
      test("should allow execution of operation with value=false in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation(
          "#operations-petOwner-listOfServiceTrainer"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // add 1st item
        await page.locator(".json-schema-form-item-add").click()
        await page
          .locator(".json-schema-form-item > select")
          .selectOption("false")
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("tags=false")
      })
      test("should allow execution of operation with value=true&value=false in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation(
          "#operations-petOwner-listOfServiceTrainer"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // add 1st item
        await page.locator(".json-schema-form-item-add").click()
        await page
          .locator(".json-schema-form-item > select")
          .selectOption("true")
        // add 2nd item
        await page.locator(".json-schema-form-item-add").click()
        await page
          .locator(".json-schema-form-item:last-of-type > select")
          .selectOption("false")
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("tags=true&tags=false")
      })
      test("should allow execution of operation with value=false after removing value=true in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation(
          "#operations-petOwner-listOfServiceTrainer"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // add 1st item
        await page.locator(".json-schema-form-item-add").click()
        await page
          .locator(".json-schema-form-item > select")
          .selectOption("true")
        // add 2nd item
        await page.locator(".json-schema-form-item-add").click()
        await page
          .locator(".json-schema-form-item:last-of-type > select")
          .selectOption("false")
        // remove 1st item
        await page
          .locator(
            ".json-schema-form-item:nth-child(1) > .json-schema-form-item-remove"
          )
          .click()
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("tags=false")
      })
      test("should allow execution of operation with value=(empty) in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation(
          "#operations-petOwner-listOfServiceTrainer"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("listOfServiceTrainer")
      })
    })
    test.describe("/petOwner/findByPreference", () => {
      test("should allow execution of operation with value=(empty) in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-petOwner-findByPreference")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("findByPreference")
      })
      test("should allow execution of operation with selected value in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-petOwner-findByPreference")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Select
        await page
          .locator(".parameters-col_description > select")
          .selectOption("dog")
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("findByPreference")
        await expect(requestUrl(page)).toContainText("dog")
      })
      test("should allow execution of operation with multiple selected values in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation("#operations-petOwner-findByPreference")
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Select
        await page
          .locator(".parameters-col_description > select")
          .selectOption(["dog", "cat"])
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("findByPreference")
        await expect(requestUrl(page)).toContainText("dog")
        await expect(requestUrl(page)).toContainText("cat")
      })
    })
    test.describe("/petOwner/createWithList", () => {
      test("should allow execution of operation with default text in textArea in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation(
          "#operations-petOwner-petOwnerCreateWithList"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("createWithList")
      })
      test("should allow execution of operation with cleared textArea in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation(
          "#operations-petOwner-petOwnerCreateWithList"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        await page.locator(".body-param__text").fill("")
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("createWithList")
      })
      test("should allow execution of operation with modified textArea in Try-It-Out", async ({
        page,
        swaggerUi,
      }) => {
        await page.goto(coreUrl)
        await swaggerUi.toggleOperation(
          "#operations-petOwner-petOwnerCreateWithList"
        )
        // Expand Try It Out
        await swaggerUi.tryItOut()
        const bodyParam = page.locator(".body-param__text")
        // `.clear().type(text)` == replace content (fill is much faster than
        // typing this many characters)
        await bodyParam.fill(`[
              {
                "id": 10,
                "petId": 201,
                "petOwnerFirstName": "John",
              },
              {
                "id": 11,
                "petId": 201,
                "petOwnerFirstName": "Jane",
              }
            ]`)
        await expect(bodyParam).toContainText("Jane")
        await expect(bodyParam).toContainText("201")
        // Execute
        await executeButton(page).click()
        // Expect new element to be visible after Execute
        await expect(clearButton(page)).toHaveText("Clear")
        // Compare Request URL
        await expect(requestUrl(page)).toContainText("createWithList")
        // Compare Curl
        await expect(page.locator(".curl")).toContainText("Jane")
        await expect(page.locator(".curl")).toContainText("201")
      })
    })
  })
})
