/**
 * @prettier
 */
import { VIRTUALIZE_MODELS_ESTIMATE_SIZE } from "src/core/utils/virtualization"

describe("OpenAPI 3.0 complex spec with allOf and nested references", () => {
  it("should render nested references", () => {
    cy.visit("/?url=/documents/features/oas3-complex-spec.json").then(() => {
      // Virtualized path - scroll the list to bring the target model into view.
      cy.get(".models-scroll").scrollTo(
        0,
        196 * VIRTUALIZE_MODELS_ESTIMATE_SIZE
      )
      cy.get(
        "[id='model-com.sap.ctsm.backend.core.api.study.v1.StudyAPIv1.StudyTreatments-create']"
      )
        .find("button")
        .click()
      cy.get(".property-row")
        .contains("scenario")
        .siblings()
        .as("scenarioSiblings")
      cy.get("@scenarioSiblings").find("button").click()
      cy.get("@scenarioSiblings")
        .find("span")
        .contains("scenarioID")
        .should("exist")
      cy.get("@scenarioSiblings")
        .find("span")
        .contains("Studies (for create)")
        .should("exist")
        .click()
      cy.get("@scenarioSiblings")
        .find("span")
        .contains("studyPhase")
        .should("exist")
    })
  })
})
