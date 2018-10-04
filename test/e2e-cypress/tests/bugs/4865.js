describe("#4865: multiple invocations + OAS3 plugin", () => {
  it("control: should render the OAS3 badge correctly", () => {
    // This is a sanity check to make sure the badge is present.
    // If this is failing, it's probably not related to #4865.
    cy.visit("/?url=/documents/petstore-expanded.openapi.yaml")
      .get("#swagger-ui")
      .get("pre.version")
      .contains("OAS3")
  })

  it("test: should render the OAS3 badge correctly after re-initializing the UI", () => {
    cy.visit("/?url=/documents/petstore-expanded.openapi.yaml")
      .window()
      .then(win => win.onload()) // re-initializes Swagger UI
      .get("#swagger-ui")
      .get("pre.version")
      .contains("OAS3")
  })
})
