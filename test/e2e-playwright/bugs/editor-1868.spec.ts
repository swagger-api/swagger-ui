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
  test("should render model content changes correctly", async ({
    page,
    schemaUi,
  }) => {
    const model = schemaUi.model("MyModel")
    const expectProperty = (name: string) =>
      schemaUi.unified
        ? expect(schemaUi.propertyModel(name, model)).toBeAttached()
        : expect(model).toContainText(name)
    await page.goto("/?url=/documents/bugs/editor-1868.yaml")

    await schemaUi.nestedModelToggle(page, ".model-toggle.collapsed").click()

    await expectProperty("a")

    // Simulate Swagger Editor updating a model
    await page.evaluate(() => {
      const { ui } = window as unknown as SwaggerUiWindow
      const content = ui.specSelectors.specStr()
      ui.specActions.updateSpec(content + `\n      b:\n        type: string`)
    })

    await expectProperty("a")
    await expectProperty("b")
  })
})
