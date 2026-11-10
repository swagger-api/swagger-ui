/**
 * @prettier
 */
import type { Page } from "@playwright/test"
import { test, expect } from "../support/fixtures"

const visit = (page: Page) =>
  page.goto(
    "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
  )

// The parameter's initial (example) value is populated asynchronously after the
// operation expands. Cypress was slow enough to never click Execute before that;
// Playwright is not, so wait until the array items are selected.
const waitForInitialArrayValue = (page: Page, operationId: string) =>
  expect(
    page.locator(`#${operationId} .parameters select[multiple] option:checked`)
  ).toHaveCount(2)

test.describe("Try it out: schema type array with example or parameter examples", () => {
  test("shows a validation error message when field is required and example is a string", async ({
    page,
    swaggerUi,
  }) => {
    await visit(page)
    await swaggerUi.toggleOperation(
      "#operations-default-get_requiredStringExample"
    )
    await page.locator(".btn.execute").click()
    await expect(page.locator(".validation-errors")).toBeAttached()
  })

  test("executes with the initial value when field is not required and example is an array", async ({
    page,
    swaggerUi,
  }) => {
    await visit(page)
    await swaggerUi.toggleOperation("#operations-default-get_arrayExample")
    await waitForInitialArrayValue(page, "operations-default-get_arrayExample")
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl.microlight")).toContainText(
      "'http://localhost:3230/arrayExample?test=test1&test=test2'"
    )
    await expect(page.locator(".validation-errors")).toHaveCount(0)
  })

  test("executes with the initial value when field is not required and example is a stringified array", async ({
    page,
    swaggerUi,
  }) => {
    await visit(page)
    await swaggerUi.toggleOperation(
      "#operations-default-get_stringifiedArrayExample"
    )
    await waitForInitialArrayValue(
      page,
      "operations-default-get_stringifiedArrayExample"
    )
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl.microlight")).toContainText(
      "'http://localhost:3230/stringifiedArrayExample?test=test1&test=test2'"
    )
    await expect(page.locator(".validation-errors")).toHaveCount(0)
  })

  test("executes without the initial value when field is not required and example is a string", async ({
    page,
    swaggerUi,
  }) => {
    await visit(page)
    await swaggerUi.toggleOperation("#operations-default-get_stringExample")
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl.microlight")).toContainText(
      "'http://localhost:3230/stringExample'"
    )
    await expect(page.locator(".validation-errors")).toHaveCount(0)
  })

  test("executes with the initial value when field is not required and parameter examples are arrays", async ({
    page,
    swaggerUi,
  }) => {
    await visit(page)
    await swaggerUi.toggleOperation(
      "#operations-default-get_parameterArrayExamples"
    )
    await waitForInitialArrayValue(
      page,
      "operations-default-get_parameterArrayExamples"
    )
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl.microlight")).toContainText(
      "'http://localhost:3230/parameterArrayExamples?test=test1&test=test2'"
    )
    await expect(page.locator(".validation-errors")).toHaveCount(0)
  })

  test("executes with the initial value when field is not required and parameter examples are stringified arrays", async ({
    page,
    swaggerUi,
  }) => {
    await visit(page)
    await swaggerUi.toggleOperation(
      "#operations-default-get_parameterStringifiedArrayExamples"
    )
    await waitForInitialArrayValue(
      page,
      "operations-default-get_parameterStringifiedArrayExamples"
    )
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl.microlight")).toContainText(
      "'http://localhost:3230/parameterStringifiedArrayExamples?test=test1&test=test2'"
    )
    await expect(page.locator(".validation-errors")).toHaveCount(0)
  })

  test("executes without the initial value when field is not required and parameter examples are strings", async ({
    page,
    swaggerUi,
  }) => {
    await visit(page)
    await swaggerUi.toggleOperation(
      "#operations-default-get_parameterStringExamples"
    )
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl.microlight")).toContainText(
      "'http://localhost:3230/parameterStringExamples'"
    )
    await expect(page.locator(".validation-errors")).toHaveCount(0)
  })

  test("executes without the chosen examples value when field is not required and parameter examples are strings", async ({
    page,
    swaggerUi,
  }) => {
    await visit(page)
    await swaggerUi.toggleOperation(
      "#operations-default-get_parameterStringExamples"
    )
    await page.locator(".examples-select-element").selectOption("example2")
    await page.locator(".btn.execute").click()
    await expect(page.locator(".curl.microlight")).toContainText(
      "'http://localhost:3230/parameterStringExamples'"
    )
    await expect(page.locator(".validation-errors")).toHaveCount(0)
  })
})
