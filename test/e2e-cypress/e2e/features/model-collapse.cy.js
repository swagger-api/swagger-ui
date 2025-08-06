describe("Model collapse/expand feature", () => {
  describe("in Swagger 2", () => {
    const swagger2BaseUrl = "/?deepLinking=true&url=/documents/features/models.swagger.yaml"
    const urlFragment = "#/definitions/Pet"
    ModelCollapseTest(swagger2BaseUrl, urlFragment)
  })
  describe("in OpenAPI 3", () => {
    const openAPI3BaseUrl = "/?deepLinking=true&url=/documents/features/models.openapi.yaml"
    ModelCollapseTest(openAPI3BaseUrl)
  })
})

function ModelCollapseTest(baseUrl) {
  it("Models section should be expanded on load", () => {
    cy.visit(baseUrl)
    .get(".models")
    .should("have.class", "is-open")
    .get("#model-Pet")
    .should("exist")
  })

  it("Models section should collapse and expand when toggled", () => {
    cy.visit(baseUrl)
    .get(".models h4 .models-control")
    .click()
    .get(".models")
    .should("not.have.class", "is-open")
    .get("#model-Order")
    .should("not.exist")
    .get(".models h4 .models-control")
    .click()
    .get(".models")
    .should("have.class", "is-open")
    .get("#model-Order")
    .should("exist")
  })

  it("Model should collapse and expand when toggled clicking button", () => {
    cy.visit(baseUrl)
    .get("#model-User .model-box .model-box-control")
    .click()
    .get("#model-User .model-box .model .inner-object")
    .should("exist")
    .get("#model-User .model-box .model-box-control")
    .first()
    .click()
    .get("#model-User .model-box .model .inner-object")
    .should("not.exist")
  })
}
