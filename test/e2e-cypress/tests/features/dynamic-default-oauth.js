describe("dynamic default oauth2RedirectUrl", () => {
  it("should compute an oauth2RedirectUrl based on the browser's location at runtime", () => {
    cy.visit("/")
      .window()
      .then(win => win.ui.getConfigs())
      .should("include", { oauth2RedirectUrl: "http://localhost:3230/oauth2-redirect.html" })
  })
  it("should compute an oauth2RedirectUrl based on the browser's location at runtime, including the path", () => {
    cy.visit("/pages/5085/")
      .window()
      .then(win => win.ui.getConfigs())
      .should("include", { oauth2RedirectUrl: "http://localhost:3230/pages/5085/oauth2-redirect.html" })
  })
  it("should compute an oauth2RedirectUrl based on the browser's location at runtime, including the path, without confusing the file name for a folder name", () => {
    cy.visit("/pages/5085/index.html")
      .window()
      .then(win => win.ui.getConfigs())
      .should("include", { oauth2RedirectUrl: "http://localhost:3230/pages/5085/oauth2-redirect.html" })
  })
  it("should compute an oauth2RedirectUrl based on the browser's location at runtime, including the path, even it does not end with a slash", () => {
    cy.visit("/pages/5085")
      .window()
      .then(win => win.ui.getConfigs())
      .should("include", { oauth2RedirectUrl: "http://localhost:3230/pages/5085/oauth2-redirect.html" })
  })
})
