/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.0 complex spec with allOf and nested references", () => {
  test("should render nested references", async ({ page, schemaUi }) => {
    await page.goto("/?url=/documents/features/oas3-complex-spec.json")

    // Virtualized path - scroll the list to bring the target model into view.
    await schemaUi
      .modelsScroll()
      .evaluate(
        (el, top) => el.scrollTo(0, top),
        196 * schemaUi.modelsEstimateSize
      )
    await schemaUi
      .modelToggle(
        schemaUi.model(
          "com.sap.ctsm.backend.core.api.study.v1.StudyAPIv1.StudyTreatments-create",
          "Study Treatments (for create)"
        ),
        "button"
      )
      .click()
    // cy `.siblings()` -> all other children of the parent; the alias is re-resolved on each use
    const scenarioSiblings = schemaUi.propertyModel("scenario")
    await schemaUi.modelToggle(scenarioSiblings, "button").click()
    await expect(
      schemaUi.nestedModelName(scenarioSiblings, "span", /scenarioID/)
    ).toBeAttached()
    const studies = schemaUi.nestedModelName(
      scenarioSiblings,
      "span",
      /Studies \(for create\)/
    )
    await expect(studies).toBeAttached()
    await schemaUi.nameToggle(studies).click()
    await expect(
      schemaUi.nestedModelName(scenarioSiblings, "span", /studyPhase/)
    ).toBeAttached()
  })
})
