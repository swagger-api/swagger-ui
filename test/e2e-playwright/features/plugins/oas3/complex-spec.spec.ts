/**
 * @prettier
 */
import { VIRTUALIZE_MODELS_ESTIMATE_SIZE } from "core/utils/virtualization"
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.0 complex spec with allOf and nested references", () => {
  test("should render nested references", async ({ page }) => {
    await page.goto("/?url=/documents/features/oas3-complex-spec.json")

    // Virtualized path - scroll the list to bring the target model into view.
    await page
      .locator(".models-scroll")
      .evaluate(
        (el, top) => el.scrollTo(0, top),
        196 * VIRTUALIZE_MODELS_ESTIMATE_SIZE
      )
    await page
      .locator(
        "[id='model-com.sap.ctsm.backend.core.api.study.v1.StudyAPIv1.StudyTreatments-create'] button"
      )
      .click()
    // cy `.siblings()` -> all other children of the parent; the alias is re-resolved on each use
    const scenarioSiblings = page
      .locator(".property-row")
      .getByText(/scenario/)
      .first()
      .locator("xpath=preceding-sibling::* | following-sibling::*")
    await scenarioSiblings.locator("button").click()
    await expect(
      scenarioSiblings
        .locator("span")
        .getByText(/scenarioID/)
        .first()
    ).toBeAttached()
    const studies = scenarioSiblings
      .locator("span")
      .getByText(/Studies \(for create\)/)
      .first()
    await expect(studies).toBeAttached()
    await studies.click()
    await expect(
      scenarioSiblings
        .locator("span")
        .getByText(/studyPhase/)
        .first()
    ).toBeAttached()
  })
})
