/**
 * Regression test for https://github.com/swagger-api/swagger-ui/issues/10234
 *
 * When Swagger UI is mounted inside a host application's <form>, clicking any
 * native <button> rendered by Swagger UI must not trigger form submission.
 * Native <button> elements default to type="submit", so every interactive
 * Swagger UI button has to set type="button" explicitly.
 */
describe("#10234: native <button> elements default to type=\"button\" when nested in a host <form>", () => {
  const visitHostFormPage = () => {
    cy.visit("/pages/10234/")
    // Allow Swagger UI to finish initializing.
    cy.window().its("completeCount").should("be.greaterThan", 0)
    // The flag must start as false; if anything causes a navigation or submit
    // before we touch a button, this assertion will fail loudly.
    cy.window().its("__swaggerUiHostFormSubmitted").should("eq", false)
  }

  const assertHostFormHasNotSubmitted = () => {
    cy.window().its("__swaggerUiHostFormSubmitted").should("eq", false)
    cy.location("pathname").should("eq", "/pages/10234/")
  }

  it("expanding a tag does not submit the host form", () => {
    visitHostFormPage()
    cy.get("button.expand-operation").first().click()
    assertHostFormHasNotSubmitted()
  })

  it("opening an operation summary does not submit the host form", () => {
    visitHostFormPage()
    cy.get("button.opblock-summary-control").first().click()
    assertHostFormHasNotSubmitted()
  })

  it("clicking the operation arrow does not submit the host form", () => {
    visitHostFormPage()
    cy.get("button.opblock-control-arrow").first().click()
    assertHostFormHasNotSubmitted()
  })

  it("clicking 'Try it out' does not submit the host form", () => {
    visitHostFormPage()
    cy.get("button.opblock-summary-control").first().click()
    cy.get("button.try-out__btn").first().click()
    assertHostFormHasNotSubmitted()
  })

  it("clicking the Schemas/Models toggle does not submit the host form", () => {
    visitHostFormPage()
    cy.get("button.models-control").first().click()
    assertHostFormHasNotSubmitted()
  })
})
