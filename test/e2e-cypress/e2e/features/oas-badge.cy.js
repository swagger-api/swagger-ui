describe("OpenAPI Badge", () => {
  it("should display light green badge with version indicator for Swagger 2.0", () => {
    cy.visit("/?url=/documents/features/info-openAPI2.yaml")
      .get("#swagger-ui")
      .get('*[class^="version-stamp"]')
      .get("pre.version")
      .contains("OAS 2.0")
  })

  it("should display light green badge with version indicator for OpenAPI 3.0.x", () => {
    cy.visit("/?url=/documents/petstore-expanded.openapi.yaml")
      .get("#swagger-ui")
      .get('*[class^="version-stamp"]')
      .get("pre.version")
      .contains("OAS 3.0")
  })

  it("should display light green badge with version indicator for OpenAPI 3.1.0", () => {
    cy.visit("/?url=/documents/features/info-openAPI31.yaml")
      .get("#swagger-ui")
      .get('*[class^="version-stamp"]')
      .get("pre.version")
      .contains("OAS 3.1")
  })
})
