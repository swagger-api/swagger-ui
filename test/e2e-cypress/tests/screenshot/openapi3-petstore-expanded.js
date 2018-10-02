describe("OpenAPI 3 Petstore Expanded Screenshots", () => {
  it("should match the current screenshot", () => {
    cy.visit("/?url=/documents/petstore-expanded.openapi.yaml&docExpansion=full")
      .wait(5000)

    cy.matchImageSnapshot("petstore-expanded-oas3")
  })
})