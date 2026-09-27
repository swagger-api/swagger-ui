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
    cy.get(".errors-wrapper .message").should("not.exist")
  })
})
