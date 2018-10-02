describe("Swagger 2.0 Petstore Screenshots", () => {
  it("should match the current screenshot", () => {
    cy.visit("/?url=/documents/petstore.swagger.yaml&docExpansion=full")
      .wait(5000)

    cy.matchImageSnapshot("petstore-2.0")
  })
})