describe("Check client_secret for OAuth2 Authorization Code flow with and without PKCE (#6290)", () => {
  it("should display client_secret field for authorization code flow with PKCE", () => {
    cy.visit(
      "/?url=/documents/features/auth-code-flow-pkce-without-secret.yaml"
    )
      .window()
      .then(win => {
        // set auth config to use PKCE
        let authConfigs = win.ui.authSelectors.getConfigs()
        win.ui.authActions.configureAuth({
          ...authConfigs,
          usePkceWithAuthorizationCodeGrant: true,
        })
      })
      .get("button.authorize")
      .click()
      .get("h4")
      .contains("authorizationCode with PKCE")
      .get(".flow")
      .contains("authorizationCode with PKCE")
      .get("#client_secret_authorizationCode")
      .should("exist")
  })

  it("should display client_secret field for authorization code flow without PKCE", () => {
    cy.visit(
      "/?url=/documents/features/auth-code-flow-pkce-without-secret.yaml"
    )
      .window()
      .then(win => {
        // set auth config to not use PKCE
        let authConfigs = win.ui.authSelectors.getConfigs()
        win.ui.authActions.configureAuth({
          ...authConfigs,
          usePkceWithAuthorizationCodeGrant: false,
        })
      })
      .get("button.authorize")
      .click()
      .get("h4")
      .contains("authorizationCode")
      .get(".flow")
      .contains("authorizationCode")
      .get("#client_secret_authorizationCode")
      .should("exist")
  })
})
