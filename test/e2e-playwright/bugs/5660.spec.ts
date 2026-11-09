/**
 * @prettier
 */
// http://github.com/swagger-api/swagger-ui/issues/5660
import { test, expect } from "../support/fixtures"

const expectedValue = "nullable: true"
const expectedUnifiedValue = "object | null"

test.describe("#5660: Nullable object", () => {
  test("should render `nullable` marker for object itself", async ({
    page,
    schemaUi,
  }) => {
    const model = schemaUi.model("SomeObject")
    await page.goto("/?url=/documents/bugs/5660-model.yaml")
    await schemaUi.modelToggle(model, ".model-toggle").click()
    await expect(schemaUi.modelBox(model, ":scope > .model-box")).toContainText(
      schemaUi.unified ? expectedUnifiedValue : expectedValue
    )
  })
  test("should render `nullable` marker for next object in property", async ({
    page,
    schemaUi,
  }) => {
    const model = schemaUi.model("SomeObject")
    await page.goto("/?url=/documents/bugs/5660-property.yaml")
    await schemaUi.modelToggle(model, ".model-toggle").click()
    await expect(schemaUi.modelBox(model, ":scope > .model-box")).toContainText(
      schemaUi.unified ? expectedUnifiedValue : expectedValue
    )
  })
})
