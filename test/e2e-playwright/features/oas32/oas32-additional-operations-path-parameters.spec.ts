/**
 * @prettier
 */
import type { Page } from "@playwright/test"
import { test, expect } from "../../support/fixtures"

test.describe("OAS 3.2 additionalOperations inherit Path Item parameters", () => {
  const baseUrl =
    "/?url=/documents/oas32/additional-operations-path-parameters.yaml"

  const operation = (page: Page, method: string) =>
    page.locator(".opblock", {
      has: page.locator(".opblock-summary-method", { hasText: method }),
    })

  const openOperation = async (page: Page, method: string) => {
    await page.goto(baseUrl)
    const opblock = operation(page, method)
    await opblock.locator(".opblock-summary-control").click()
    await expect(opblock).toHaveClass(/(^|\s)is-open(\s|$)/)
    return opblock
  }

  test("shows path-level parameters for an operation without its own parameters", async ({
    page,
  }) => {
    const opblock = await openOperation(page, "COPY")
    await expect(opblock.getByText("No parameters")).toHaveCount(0)
    const id = opblock.locator('tr[data-param-name="id"][data-param-in="path"]')
    await expect(id).toBeAttached()
    await expect(id).toContainText("File ID")
    const q = opblock.locator('tr[data-param-name="q"][data-param-in="query"]')
    await expect(q).toBeAttached()
    await expect(q).toContainText("Path-level query")
  })

  test("lets operation-level parameters override path-level ones without removing the rest", async ({
    page,
  }) => {
    const opblock = await openOperation(page, "MOVE")
    await expect(
      opblock.locator('tr[data-param-name="id"][data-param-in="path"]')
    ).toBeAttached()
    const q = opblock.locator('tr[data-param-name="q"][data-param-in="query"]')
    await expect(q).toHaveCount(1)
    await expect(q).toContainText("Operation-level override")
    await expect(q).not.toContainText("Path-level query")
  })
})
