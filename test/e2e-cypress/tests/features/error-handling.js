describe("error handling: overriding how errors are hanlded", () => {
  it("should override componentDidCatch", () => {
    cy
      .visit("/pages/error-handling/component-did-catch.html?url=/documents/petstore-expanded.openapi.yaml", {
        onBeforeLoad(win) {
          cy.stub(win.console, "error").as("consoleError")
          cy.stub(win.console, "debug").as("consoleDebug")
        }
      })
      .reload()
      .then(() => {
        cy.get("@consoleError").should("not.be.called")
        cy.get("@consoleDebug").should("be.callCount", 4)
      })
  })

  it("should override Fallback component", () => {
    cy
      .visit("/pages/error-handling/fallback.html?url=/documents/petstore-expanded.openapi.yaml")
      .reload()
      .contains("rendering failed in BaseLayout")
  })

  it("should override ErrorBoundary component", () => {
    cy.on("uncaught:exception", () => false)

    cy
      .visit("/pages/error-handling/error-boundary.html?url=/documents/petstore-expanded.openapi.yaml")
      .reload()
      .contains("custom fallback for BaseLayout")

  })
})
