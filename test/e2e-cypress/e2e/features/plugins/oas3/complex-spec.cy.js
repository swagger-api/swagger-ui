/**
 * @prettier
 */

describe("OpenAPI 3.0 complex spec with allOf and nested references", () => {
  it("should render nested references", () => {
    cy.visit("/?url=/documents/features/oas3-complex-spec.json").then(() => {
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
        .contains("Scenarios (for create)")
        .should("not.exist")
      cy.get("@scenarioSiblings")
        .find("span")
        .contains("scenarioID")
        .should("exist")
      cy.get(".property-row")
        .contains("kitTypeAssignments")
        .siblings()
        .as("kitTypeAssignmentsSiblings")
      cy.get("@kitTypeAssignmentsSiblings").find("button").click()
      cy.get("@kitTypeAssignmentsSiblings")
        .find("span")
        .contains("Kit Type Treatment Assignments (for create)")
        .should("exist")
        .click()
      cy.get("@kitTypeAssignmentsSiblings")
        .find("span")
        .contains("kitType")
        .should("exist")
    })
  })
})
