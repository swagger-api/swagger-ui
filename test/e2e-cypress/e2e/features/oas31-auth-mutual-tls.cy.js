describe("MutualTLS Authorization", () => {

  it("should open authorization popup", () => {
    cy.visit(
      "/?url=/documents/security/mutual-tls.yaml"
    )
      .get("button.authorize")
      .click()
      .get(".auth-container h4")
      .contains("mutual (mutualTLS)")
  })
  it("should have description given by user", () => {
    cy.visit(
      "/?url=/documents/security/mutual-tls.yaml"
    )
      .get("button.authorize")
      .click()
      .get(".auth-container p:nth-of-type(2)")
      .contains("Mutual TLS description")
  })
   it("should not display Authorize or Logout buttons", () => {
    cy.visit(
      "/?url=/documents/security/mutual-tls.yaml"
    )
      .get("button.authorize")
      .click()
      .get(".auth-button-wrapper")
      .should("not.exist")
  })
})
