/**
 * @prettier
 */

describe("Parameter with oneOf + const pattern (enum with descriptions) in OpenAPI 3.1.0", () => {
  beforeEach(() => {
    cy.visit(
      "/?url=/documents/features/parameter-oneof-const-descriptions.yaml"
    )
    cy.get("#operations-default-get_test").click()
  })

  it("should render dropdown for oneOf with const values in Try it out mode", () => {
    // Enable try it out
    cy.get(".try-out__btn").click()

    // Check that the cvv_check parameter has a select dropdown
    cy.get("[data-param-name='cvv_check']")
      .closest("tr")
      .find("select")
      .should("exist")
      .find("option")
      .should("have.length", 9) // 8 values + empty option

    // Check that the dropdown contains the const values
    cy.get("[data-param-name='cvv_check']")
      .closest("tr")
      .find("select")
      .find("option[value='D']")
      .should("exist")
  })

  it("should display descriptions for oneOf with const values in read-only mode", () => {
    // Check that the descriptions are displayed in read-only mode
    cy.get("[data-param-name='cvv_check']")
      .closest("tr")
      .find(".parameter__enum")
      .should("exist")
      .should("contain", "Suspicious transaction")
      .should("contain", "Match")
      .should("contain", "No Match")
  })

  it("should display titles for oneOf with const values when available", () => {
    // Check that titles are displayed for the status parameter
    cy.get("[data-param-name='status']")
      .closest("tr")
      .find(".parameter__enum")
      .should("exist")
      .should("contain", "Pending")
      .should("contain", "Processing")
      .should("contain", "Completed")
      .should("contain", "Cancelled")
  })

  it("should show dropdown with titles as labels in Try it out mode", () => {
    // Enable try it out
    cy.get(".try-out__btn").click()

    // Check that the status parameter dropdown shows titles as labels
    cy.get("[data-param-name='status']")
      .closest("tr")
      .find("select")
      .should("exist")
      .find("option")
      .contains("Pending")
      .should("exist")

    cy.get("[data-param-name='status']")
      .closest("tr")
      .find("select")
      .find("option")
      .contains("Completed")
      .should("exist")
  })
})
