describe("XSS: OAuth2 authorizationUrl sanitization", () => {
  it("should filter out a javascript URL", () => {
    cy.visit("/?url=/documents/xss/oauth2.yaml")
      .window()
      .then(win => {
        cy.stub(win, "open").as("windowOpen")
        cy.get(".authorize")
          .click()
          .get(".modal-btn.authorize")
          .click()

        cy.get("@windowOpen").should("be.calledWith", "page1.html")
      })
  })
})
