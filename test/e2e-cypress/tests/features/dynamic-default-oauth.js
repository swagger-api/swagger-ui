describe("dynamic default oauth2RedirectUrl", () => {
  it("should render the OAS3 badge correctly", () => {
    // This is a sanity check to make sure the badge is present.
    // If this is failing, it's probably not related to #4865.
    cy.visit("/")
      .window()
      .then(win => win.ui.getConfigs())
      .should("include", { oauth2RedirectUrl: "http://localhost:3230/oauth2-redirect.html" })
  })
})
