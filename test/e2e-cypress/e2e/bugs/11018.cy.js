/**
 * @prettier
 */

describe("Issue #11018: external array item refs", () => {
  it("resolves local array item refs in an external schema", () => {
    cy.visit("/?url=/documents/bugs/11018/openapi.yml")
      .get(".opblock-summary-path span")
      .contains("/charts")
      .click()

    cy.get(".opblock-body").should("contain.text", "Request body")
    cy.window().then((win) => {
      const schema = win.ui.specSelectors
        .specResolvedSubtree([
          "paths",
          "/charts",
          "post",
          "requestBody",
          "content",
          "application/json",
          "schema",
        ])
        .toJS()

      expect(schema.allOf).to.have.length(2)
      expect(
        schema.allOf[1].oneOf[0].properties.chartTypes.items.enum
      ).to.deep.equal(["line", "bar", "pie"])
    })
    cy.get(".errors-wrapper .message").should("not.exist")
  })
})
