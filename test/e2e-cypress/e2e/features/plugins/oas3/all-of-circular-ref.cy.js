/**
 * @prettier
 */

describe("OpenAPI 3.0 spec with allOf containing a circular reference", () => {
  it("should render correct title and properties", () => {
    cy.visit("/?url=/documents/features/oas3-all-of-circular-ref.yaml").then(
      () => {
        cy.get("[id='model-OneOfParent']").find("button").click()
        cy.get(".property-row")
          .contains("additionalData")
          .siblings()
          .as("additionalData")
        cy.get("@additionalData").find("button").click()
        cy.get("@additionalData")
          .find("span")
          .contains("FirstOneOf")
          .should("exist")
          .click()
        cy.get("@additionalData")
          .find("span")
          .contains("numberProp")
          .should("exist")
        cy.get("@additionalData")
          .find("span")
          .contains("additionalData")
          .should("exist")
      }
    )
  })
})
