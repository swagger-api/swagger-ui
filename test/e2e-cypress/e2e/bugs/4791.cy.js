describe("#4791: application/octet-stream response should not show synthetic example", () => {
  it("does not render a synthetic 'string' example for a binary response with no user example", () => {
    cy.visit("?url=/documents/bugs/4791.yaml")
      .get("#operations-default-downloadBinary")
      .click()
      .get(".responses-wrapper")
      .within(() => {
        cy.get('[data-name="examplePanel"]')
          .should("contain.text", "no example available")
        cy.get('[data-name="examplePanel"] .example')
          .should("not.exist")
      })
  })

  it("renders the user-supplied example for a binary response", () => {
    cy.visit("?url=/documents/bugs/4791.yaml")
      .get("#operations-default-downloadBinaryWithExample")
      .click()
      .get(".responses-wrapper")
      .within(() => {
        cy.get('[data-name="examplePanel"] .example')
          .should("include.text", "user-supplied-example")
      })
  })
})
