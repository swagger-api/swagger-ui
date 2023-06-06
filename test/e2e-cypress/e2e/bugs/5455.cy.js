// http://github.com/swagger-api/swagger-ui/issues/5455

describe("#5455: Request bodies w/o `examples` should not render a dropdown", () => {
  it("should not render a <select> element", () => {
    cy.visit("/?url=/documents/bugs/5455.yaml")
      .get("#operations-default-post_foo")
      .click()
      .get(".opblock-section-request-body > .opblock-description-wrapper")
      .should("not.have.descendants", "select")
  })
})
