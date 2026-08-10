describe("Authorization popup", () => {
  it("closes the Available authorizations dialog when Escape is pressed", () => {
    cy.visit("/?url=/documents/petstore.swagger.yaml")
      .get("button.btn.authorize")
      .click()
      .get(".dialog-ux")
      .should("exist")

    // Trigger on document (what the popup actually listens on) instead of body,
    // which skips Cypress's actionability checks against the full-page dialog overlay
    cy.document().trigger("keydown", { key: "Escape", eventConstructor: "KeyboardEvent" })

    cy.get(".dialog-ux").should("not.exist")
  })

  it("closes the Available authorizations dialog when the backdrop is clicked", () => {
    cy.visit("/?url=/documents/petstore.swagger.yaml")
      .get("button.btn.authorize")
      .click()
      .get(".dialog-ux")
      .should("exist")
      .get(".backdrop-ux")
      .click({ force: true })
      .get(".dialog-ux")
      .should("not.exist")
  })
})
