// http://github.com/swagger-api/swagger-ui/issues/5458

const expectedValue = `{
  "foo": "custom value"
}`

describe("#5458: Swagger 2.0 `Response.examples` mappings", () => {
  it("should render a custom example when a schema is not defined", () => {
    cy.visit("/?url=/documents/bugs/5458.yaml")
      .get("#operations-default-get_foo1")
      .click()
      .get(".model-example .highlight-code")
      .contains(expectedValue)
  })
  it("should render a custom example when a schema is defined", () => {
    cy.visit("/?url=/documents/bugs/5458.yaml")
      .get("#operations-default-get_foo2")
      .click()
      .get(".model-example .highlight-code")
      .contains(expectedValue)
  })
})
