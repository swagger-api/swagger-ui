describe("OpenAPI 3.0 Schema rendering", () => {
  it("should render the Schema tab in Try it out mode for request body", () => {
    cy
      .visit("?url=/documents/features/oas3-xml.json")
      .get("#operations-default-post_foo")
      .click()
      .get(".btn.try-out__btn")
      .click()
      .get(".opblock-section-request-body")
      .within(() => {
        cy.contains("button", "Schema")
          .should("exist")
          .and("be.visible")
          .click()

        cy
          .get('[data-name="modelPanel"]')
          .should("be.visible")

        cy
          .get('[data-name="examplePanel"]')
          .should("not.exist")
      })
  })
})
