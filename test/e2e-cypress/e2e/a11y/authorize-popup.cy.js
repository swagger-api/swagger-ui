describe("Authorization popup", () => {
  it("closes the Available authorizations dialog when Escape is pressed", () => {
    cy.visit("/?url=/documents/petstore.swagger.yaml")
      .get("button.btn.authorize")
      .click()
      .get(".dialog-ux")
      .should("exist")
      .get("body")
      .trigger("keydown", { key: "Escape", eventConstructor: "KeyboardEvent" })
      .get(".dialog-ux")
      .should("not.exist")
  })
})
