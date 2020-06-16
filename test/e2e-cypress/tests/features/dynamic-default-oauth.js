describe("dynamic default oauth2RedirectUrl", () => {
  it("should compute an oauth2RedirectUrl based on the browser's location at runtime", () => {
    cy.visit("/")
      .window()
      .then(win => win.ui.getConfigs())
      .should("include", { oauth2RedirectUrl: "http://localhost:3230/oauth2-redirect.html" })
  })
})
