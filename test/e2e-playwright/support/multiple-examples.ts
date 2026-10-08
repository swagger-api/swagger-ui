/**
 * @prettier
 */
import { test, expect } from "./fixtures"

const SPEC_URL = "/?url=/documents/features/multiple-examples-core.openapi.yaml"

interface Example {
  key: string
  value: string
  summary?: string
  serializedValue?: string
}

interface ParameterOptions {
  operationDomId: string
  parameterName: string
  exampleA: Example
  exampleB: Example
  exampleC?: Example
  customUserInput: string
  customExpectedUrlSubstring?: string
}

interface RequestBodyOptions {
  operationDomId: string
  exampleA: Example
  exampleB: Example
  exampleC?: Example
  customUserInput: string
  customUserInputExpectedCurlSubstring?: string
  primaryMediaType?: string
  secondaryMediaType?: string
}

interface ResponseOptions {
  operationDomId: string
  exampleA: Example
  exampleB: Example
  exampleC?: Example
}

// Cypress's `.type()` treats `{{}` as an escaped literal `{`; `fill()` has no
// special sequences, so the escape has to be resolved by hand.
const unescapeCypressType = (text: string) => text.replace(/{{}/g, "{")

export function ParameterPrimitiveTestCases({
  operationDomId,
  parameterName,
  exampleA,
  exampleB,
  exampleC,
  customUserInput,
  customExpectedUrlSubstring,
}: ParameterOptions) {
  const paramRow = `tr[data-param-name="${parameterName}"]`
  const paramInput = `${paramRow} input, ${paramRow} textarea`
  const examplesSelect = "table.parameters .examples-select > select"

  test("should render examples options without Modified Value by default", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await expect(
      page.locator(`${paramRow} .examples-select option`)
    ).toHaveCount(exampleC ? 3 : 2)
    // Ensure the relevant input is disabled
    await expect(page.locator(paramInput)).toHaveAttribute("disabled")
    // Switch to Try-It-Out
    await swaggerUi.tryItOut()
    await expect(
      page.locator(".opblock-section-request-body .examples-select option")
    ).toHaveCount(exampleC ? 3 : 2)
  })

  test("should set default static and Try-It-Out values based on the first member", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Assert on the static docs value
    await expect(page.locator(paramInput)).toHaveValue(exampleA.value)
    await swaggerUi.tryItOut()
    // Assert on the Try-It-Out value
    await expect(page.locator(paramInput)).toHaveValue(exampleA.value)
    await swaggerUi.execute()
    // Assert on the request URL
    await expect(page.locator(".request-url")).toContainText(
      exampleA.serializedValue || `?message=${escape(exampleA.value)}`
    )
  })

  test("should set static and Try-It-Out values based on the second member", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Choose the second example
    await page.locator(examplesSelect).selectOption(exampleB.key)
    // Assert on the static docs value
    await expect(page.locator(paramInput)).toHaveValue(exampleB.value)
    await swaggerUi.tryItOut()
    // Assert on the Try-It-Out value
    await expect(page.locator(paramInput)).toHaveValue(exampleB.value)
    await swaggerUi.execute()
    // Assert on the request URL
    await expect(page.locator(".request-url")).toContainText(
      exampleB.serializedValue
        ? `?${exampleB.serializedValue}`
        : `?message=${escape(exampleB.value)}`
    )
  })

  test("should handle user-entered values correctly", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await swaggerUi.tryItOut()
    // Modify the input value
    await page.locator(paramInput).fill(unescapeCypressType(customUserInput))
    // Assert on the active select menu item
    await expect(page.locator(`${examplesSelect} option:checked`)).toHaveText(
      "[Modified value]"
    )
    await swaggerUi.execute()
    // Assert on the request URL
    await expect(page.locator(".request-url")).toContainText(
      customExpectedUrlSubstring || `?message=${escape(customUserInput)}`
    )
  })

  test("should retain user-entered values correctly", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await swaggerUi.tryItOut()
    // Modify the input value
    await page.locator(paramInput).fill(unescapeCypressType(customUserInput))
    // the input is debounced (350ms); wait until the edit landed, otherwise it
    // would overwrite the example selected below
    await expect(page.locator(`${examplesSelect} option:checked`)).toHaveText(
      "[Modified value]"
    )
    // Select the first example
    await page.locator(examplesSelect).selectOption(exampleA.key)
    await swaggerUi.execute()
    // Assert on the request URL
    await expect(page.locator(".request-url")).toContainText(
      exampleA.serializedValue
        ? `?${exampleA.serializedValue}`
        : `?message=${escape(exampleA.value)}`
    )
    // Select the modified value
    await page.locator(examplesSelect).selectOption("__MODIFIED__VALUE__")
    await swaggerUi.execute()
    // Assert on the request URL
    await expect(page.locator(".request-url")).toContainText(
      customExpectedUrlSubstring || `?message=${escape(customUserInput)}`
    )
  })
}

export function RequestBodyPrimitiveTestCases({
  operationDomId,
  exampleA,
  exampleB,
  exampleC,
  customUserInput,
  customUserInputExpectedCurlSubstring,
  primaryMediaType = "text/plain",
  secondaryMediaType = "text/plain+other",
}: RequestBodyOptions) {
  const requestBody = ".opblock-section-request-body"
  const examplesSelect = `${requestBody} .examples-select > select`
  const selectedExample = `${examplesSelect} option:checked`
  const staticValue = `${requestBody} .microlight`
  const tryItOutValue = `${requestBody} textarea`
  const contentType = `${requestBody} .content-type`

  test("should render examples options without Modified Value by default", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await expect(
      page.locator(`${requestBody} .examples-select option`)
    ).toHaveCount(exampleC ? 3 : 2)
    await swaggerUi.tryItOut()
    await expect(
      page.locator(`${requestBody} .examples-select option`)
    ).toHaveCount(exampleC ? 3 : 2)
  })

  test("should set default static and Try-It-Out values based on the first member", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Assert on the static docs value
    await expect(page.locator(staticValue)).toContainText(exampleA.value)
    await swaggerUi.tryItOut()
    // Assert on the Try-It-Out value
    await expect(page.locator(tryItOutValue)).toHaveValue(exampleA.value)
    await swaggerUi.execute()
    // Assert on the curl body
    // TODO: use an interceptor instead of curl
    await expect(page.locator(".curl")).toContainText(
      `-d '${exampleA.serializedValue || exampleA.value}'`
    )
  })

  test("should set default static and Try-It-Out values based on choosing the second member in static mode", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Choose the second example
    await page.locator(examplesSelect).selectOption(exampleB.key)
    // Assert on the static docs value
    await expect(page.locator(staticValue)).toContainText(exampleB.value)
    await swaggerUi.tryItOut()
    // Assert on the Try-It-Out value
    await expect(page.locator(tryItOutValue)).toHaveValue(exampleB.value)
    await swaggerUi.execute()
    // TODO: use an interceptor instead of curl
    await expect(page.locator(".curl")).toContainText(
      `-d '${exampleB.serializedValue || exampleB.value}'`
    )
  })

  test("should set default static and Try-It-Out values based on choosing the second member in Try-It-Out mode", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await swaggerUi.tryItOut()
    // Choose the second example
    await page.locator(examplesSelect).selectOption(exampleB.key)
    // Assert on the Try-It-Out value
    await expect(page.locator(tryItOutValue)).toHaveValue(exampleB.value)
    await swaggerUi.execute()
    // TODO: use an interceptor instead of curl
    await expect(page.locator(".curl")).toContainText(
      `-d '${exampleB.serializedValue || exampleB.value}'`
    )
    // Switch to static docs
    await swaggerUi.tryItOut()
    // Assert on the static docs value
    await expect(page.locator(staticValue)).toContainText(exampleB.value)
  })

  test("should return the dropdown entry for an example when manually returning to its value", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Assert on the static docs value
    await expect(page.locator(staticValue)).toContainText(exampleA.value)
    await swaggerUi.tryItOut()
    // Assert on the Try-It-Out value
    await expect(page.locator(tryItOutValue)).toHaveValue(exampleA.value)
    // Clear the Try-It-Out value, replace it with custom value
    await page.locator(tryItOutValue).fill(unescapeCypressType(customUserInput))
    // Assert on the dropdown value
    await expect(page.locator(selectedExample)).toHaveText("[Modified value]")
    // Modify the value again, going back to the example value
    await page.locator(tryItOutValue).fill(unescapeCypressType(exampleA.value))
    // Assert on the dropdown value returning to the example value
    await expect(page.locator(selectedExample)).toContainText(
      exampleA.summary ?? ""
    )
  })

  test("should retain choosing a member in static docs when changing the media type", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Choose the second example
    await page.locator(examplesSelect).selectOption(exampleB.key)
    // Change the media type
    await page.locator(contentType).selectOption(secondaryMediaType)
    // Assert on the static docs value
    await expect(page.locator(staticValue)).toContainText(exampleB.value)
    await swaggerUi.tryItOut()
    // Assert on the Try-It-Out value
    await expect(page.locator(tryItOutValue)).toHaveValue(exampleB.value)
    await swaggerUi.execute()
    // TODO: use an interceptor instead of curl
    await expect(page.locator(".curl")).toContainText(
      `-d '${exampleB.serializedValue || exampleB.value}'`
    )
  })

  test("should use the first example for the media type when changing the media type without prior interactions with the value", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Change the media type
    await page.locator(contentType).selectOption(secondaryMediaType)
    // Assert on the static docs value
    await expect(page.locator(staticValue)).toContainText(exampleA.value)
    await swaggerUi.tryItOut()
    // Assert on the Try-It-Out value
    await expect(page.locator(tryItOutValue)).toHaveValue(exampleA.value)
    await swaggerUi.execute()
    // TODO: use an interceptor instead of curl
    await expect(page.locator(".curl")).toContainText(
      `-d '${exampleA.serializedValue || exampleA.value}'`
    )
  })

  test("static mode toggling: mediaType -> example -> mediaType -> example", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Change the media type
    await page.locator(contentType).selectOption(secondaryMediaType)
    await expect(page.locator(staticValue)).toContainText(exampleA.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleA.summary ?? ""
    )

    // Choose exampleB
    await page.locator(examplesSelect).selectOption(exampleB.key)
    await expect(page.locator(staticValue)).toContainText(exampleB.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )

    // Change the media type
    await page.locator(contentType).selectOption(primaryMediaType)
    // Assert that the static docs value and the dropdown value didn't change
    await expect(page.locator(staticValue)).toContainText(exampleB.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )

    // Choose exampleA
    await page.locator(examplesSelect).selectOption(exampleA.key)
    await expect(page.locator(staticValue)).toContainText(exampleA.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleA.summary ?? ""
    )
  })

  test("Try-It-Out toggling: mediaType -> example -> mediaType -> example", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await swaggerUi.tryItOut()
    // Change the media type
    await page.locator(contentType).selectOption(secondaryMediaType)
    await expect(page.locator(tryItOutValue)).toContainText(exampleA.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleA.summary ?? ""
    )

    // Choose exampleB
    await page.locator(examplesSelect).selectOption(exampleB.key)
    await expect(page.locator(tryItOutValue)).toContainText(exampleB.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )

    // Change the media type
    await page.locator(contentType).selectOption(primaryMediaType)
    // Assert that the value and the dropdown value didn't change
    await expect(page.locator(tryItOutValue)).toContainText(exampleB.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )

    // Choose exampleA
    await page.locator(examplesSelect).selectOption(exampleA.key)
    await expect(page.locator(tryItOutValue)).toContainText(exampleA.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleA.summary ?? ""
    )
  })

  test("Try-It-Out toggling and execution with modified values: mediaType -> modified value -> example -> mediaType -> example", async ({
    page,
    swaggerUi,
  }) => {
    const expectedCurlBody = `-d '${
      customUserInputExpectedCurlSubstring || customUserInput
    }'`

    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await swaggerUi.tryItOut()
    // Change the media type
    await page.locator(contentType).selectOption(secondaryMediaType)
    await expect(page.locator(tryItOutValue)).toContainText(exampleA.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleA.summary ?? ""
    )

    // Modify the value
    await page.locator(tryItOutValue).fill(unescapeCypressType(customUserInput))
    await expect(page.locator(selectedExample)).toHaveText("[Modified value]")
    await swaggerUi.execute()
    // TODO: use an interceptor instead of curl
    await expect(page.locator(".curl")).toContainText(expectedCurlBody)

    // Choose exampleB
    await page.locator(examplesSelect).selectOption(exampleB.key)
    await expect(page.locator(tryItOutValue)).toContainText(exampleB.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )
    await swaggerUi.execute()
    await expect(page.locator(".curl")).toContainText(
      `-d '${exampleB.serializedValue || exampleB.value}'`
    )

    // Ensure the modified value is still accessible
    await expect(page.locator(examplesSelect)).toContainText("[Modified value]")

    // Change the media type to text/plain
    await page.locator(contentType).selectOption(primaryMediaType)
    // Assert that the value and the dropdown value didn't change
    await expect(page.locator(tryItOutValue)).toContainText(exampleB.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )
    await swaggerUi.execute()
    await expect(page.locator(".curl")).toContainText(
      `-d '${exampleB.serializedValue || exampleB.value}'`
    )

    // Ensure the modified value is still accessible
    await expect(page.locator(examplesSelect)).toContainText("[Modified value]")

    // Choose exampleA
    await page.locator(examplesSelect).selectOption(exampleA.key)
    await expect(page.locator(tryItOutValue)).toContainText(exampleA.value)
    await expect(page.locator(selectedExample)).toContainText(
      exampleA.summary ?? ""
    )
    await swaggerUi.execute()
    await expect(page.locator(".curl")).toContainText(
      `-d '${exampleA.serializedValue || exampleA.value}'`
    )

    // Ensure the modified value is still the same value
    await page.locator(examplesSelect).selectOption("__MODIFIED__VALUE__")
    await expect(page.locator(tryItOutValue)).toHaveText(
      unescapeCypressType(customUserInput)
    )
    await expect(page.locator(selectedExample)).toHaveText("[Modified value]")
    await swaggerUi.execute()
    await expect(page.locator(".curl")).toContainText(expectedCurlBody)
  })

  // TODO: Try-It-Out + Try-It-Out media type changes
}

export function ResponsePrimitiveTestCases({
  operationDomId,
  exampleA,
  exampleB,
  exampleC,
}: ResponseOptions) {
  const responses = ".responses-wrapper"
  const examplesSelect = `${responses} .examples-select > select`
  const selectedExample = `${examplesSelect} option:checked`
  const exampleValue = `${responses} .microlight`
  const contentType = `${responses} .content-type`

  test("should render the first example by default", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await expect(page.locator(selectedExample)).toContainText(
      exampleA.summary ?? ""
    )
    await expect(page.locator(exampleValue)).toContainText(exampleA.value)
  })

  test("should render the second example", async ({ page, swaggerUi }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    await page.locator(examplesSelect).selectOption(exampleB.key)
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )
    await expect(page.locator(exampleValue)).toContainText(exampleB.value)
  })

  test("should retain an example choice across media types if they share the same example", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation(operationDomId)
    // Change examples
    await page.locator(examplesSelect).selectOption(exampleB.key)
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )
    await expect(page.locator(exampleValue)).toContainText(exampleB.value)

    // Change media types
    await page.locator(contentType).selectOption("text/plain+other")
    await expect(page.locator(selectedExample)).toContainText(
      exampleB.summary ?? ""
    )
    await expect(page.locator(exampleValue)).toContainText(exampleB.value)
  })

  // the third example only exists for some operations
  const testIfExampleC = exampleC ? test : test.skip
  testIfExampleC(
    "should reset to the first example if the new media type lacks the current example",
    async ({ page, swaggerUi }) => {
      await page.goto(SPEC_URL)
      await swaggerUi.toggleOperation(operationDomId)
      // Change media types
      await page.locator(contentType).selectOption("text/plain+other")
      // Change examples
      await page.locator(examplesSelect).selectOption(exampleC?.key ?? "")
      await expect(page.locator(selectedExample)).toContainText(
        exampleC?.summary || exampleC?.key || ""
      )
      await expect(page.locator(exampleValue)).toContainText(
        exampleC?.value ?? ""
      )

      // Change media types
      await page.locator(contentType).selectOption("text/plain")
      await expect(page.locator(selectedExample)).toContainText(
        exampleA.summary ?? ""
      )
      await expect(page.locator(exampleValue)).toContainText(exampleA.value)
    }
  )
}
