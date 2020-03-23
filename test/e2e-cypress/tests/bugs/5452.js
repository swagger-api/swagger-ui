/**
 * @prettier
 */

describe("#5452: <Select /> crashing in Parameters", function() {
  describe("in OpenAPI 3", () => {
    it("should not result in a render error", function() {
      cy.visit("http://localhost:3230/?url=/documents/bugs/5452/openapi.yaml")
        .get("#operations-default-get_endpoint")
        .click()
        .get(".try-out__btn")
        .click()
        .get(".parameters > tbody > tr > .parameters-col_description > select")
        .select("")
        .get(".parameters > tbody > tr > .parameters-col_description > select")
        .should("exist")
        .select("fruit")
        .get(".parameters > tbody > tr > .parameters-col_description > select")
        .should("exist")
    })
  })
  describe("in Swagger 2", () => {
    it("should not result in a render error", function() {
      cy.visit("http://localhost:3230/?url=/documents/bugs/5452/swagger.yaml")
        .get("#operations-default-get_endpoint")
        .click()
        .get(".try-out__btn")
        .click()
        .get(".parameters > tbody > tr > .parameters-col_description > select")
        .select("")
        .get(".parameters > tbody > tr > .parameters-col_description > select")
        .should("exist")
        .select("fruit")
        .get(".parameters > tbody > tr > .parameters-col_description > select")
        .should("exist")
    })
  })
})
