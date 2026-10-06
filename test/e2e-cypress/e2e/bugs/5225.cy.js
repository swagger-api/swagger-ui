/**
 * @prettier
 */
// http://github.com/swagger-api/swagger-ui/issues/5225

describe("#5225: loading new URL does not reset schemes value if schemes unset", () => {
  it("should not retain the previous spec's scheme when the new spec omits schemes", () => {
    cy.visit("?url=/documents/bugs/5225-with-schemes.yaml")
      // Wait for the first spec (which declares `schemes: [https]`) to render
      .get("#operations-default-getPing", { timeout: 10000 })
      .should("exist")

    // Switch to a spec that does NOT declare any `schemes`. Use the spec
    // actions directly (mirrors how the TopBar swaps specs) so the test does
    // not depend on TopBar markup details.
    cy.window().then((win) => {
      win.ui.specActions.updateUrl("/documents/bugs/5225-without-schemes.yaml")
      win.ui.specActions.download("/documents/bugs/5225-without-schemes.yaml")
    })

    // Wait for the second spec to load
    cy.get("#operations-default-getPong", { timeout: 10000 })
      .should("exist")
      .click()
      .get(".try-out__btn")
      .click()
      .get(".btn.execute")
      .click()

    // The generated curl URL should be derived from the page URL scheme
    // (http when served from http://localhost), NOT the leaked `https`
    // default from the previously loaded spec.
    cy.get(".curl-command", { timeout: 10000 })
      .should("contain", "http://example.com/pong")
      .and("not.contain", "https://example.com/pong")
  })
})
