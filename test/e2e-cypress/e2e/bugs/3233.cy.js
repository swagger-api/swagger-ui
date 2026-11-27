describe("#3233: x-examples should populate the body parameter example for OAS 2.0", () => {
  it("renders the x-examples 'default' value as the request body example", () => {
    cy.visit("?url=/documents/bugs/3233.yaml")
      .get("#operations-default-dataTargets")
      .click()
      .get(".opblock-section")
      .within(() => {
        cy.get(".body-param__example")
          .should("be.visible")
          .should("include.text", "targets")
          .should("include.text", "1")
          .should("include.text", "4")
      })
  })

  it("populates the request body textarea with x-examples when 'Try it out' is enabled", () => {
    cy.visit("?url=/documents/bugs/3233.yaml")
      .get("#operations-default-dataTargets")
      .click()
      .get(".try-out__btn")
      .click()
      .get("textarea.body-param__text")
      .should("contain.value", "targets")
  })
})
