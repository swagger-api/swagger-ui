/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

interface SwaggerUiWindow {
  ui: {
    specSelectors: { specStr: () => string }
    specActions: { updateSpec: (spec: string) => void }
  }
}

test.describe("Editor #1868: model changes break rendering", () => {
  test("should render model content changes correctly", async ({ page }) => {
    await page.goto("/?url=/documents/bugs/editor-1868.yaml")

    await page.locator(".model-toggle.collapsed").click()

    await expect(page.locator("#model-MyModel")).toContainText("a")

    // Simulate Swagger Editor updating a model
    await page.evaluate(() => {
      const { ui } = window as unknown as SwaggerUiWindow
      const content = ui.specSelectors.specStr()
      ui.specActions.updateSpec(content + `\n      b:\n        type: string`)
    })

    await expect(page.locator("#model-MyModel")).toContainText("a")
    await expect(page.locator("#model-MyModel")).toContainText("b")
  })
})
