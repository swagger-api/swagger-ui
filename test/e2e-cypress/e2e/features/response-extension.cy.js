describe("Response extension feature", () => {
  describe("in Swagger 2", () => {
    const swagger2BaseUrl = "/?showExtensions=true&docExpansion=full&url=/documents/features/response-extension.swagger.yaml"

    describe("without x- values", () => {
      it("should omit response extensions section", () => {
        cy.visit(swagger2BaseUrl)
          .get("tr.response[data-code='200'] td.response-col_description div.response__extension")
          .should("not.exist")
      })
    })

    describe("with x- values", () => {
      it("should list each value", () => {
        const page = cy.visit(swagger2BaseUrl)

        page.get("tr.response[data-code='404'] td.response-col_description div.response__extension:nth-child(2)")
          .should("have.text", "x-error: true")

        page.get("tr.response[data-code='404'] td.response-col_description div.response__extension:nth-child(3)")
        .should("have.text", "x-error-codes: List [ \"NOT_FOUND\" ]")
      })
    })
  })

  describe("in OpenAPI 3", () => {
    const openAPI3BaseUrl = "/?showExtensions=true&docExpansion=full&url=/documents/features/response-extension.openapi.yaml"

    describe("without x- values", () => {
      it("should omit response extensions section", () => {
        cy.visit(openAPI3BaseUrl)
          .get("tr.response[data-code='200'] td.response-col_description div.response__extension")
          .should("not.exist")
      })
    })

    describe("with x- values", () => {
      it("should list each value", () => {
        const page = cy.visit(openAPI3BaseUrl)

        page.get("tr.response[data-code='404'] td.response-col_description div.response__extension:nth-child(2)")
          .should("have.text", "x-error: true")

        page.get("tr.response[data-code='404'] td.response-col_description div.response__extension:nth-child(3)")
        .should("have.text", "x-error-codes: List [ \"NOT_FOUND\" ]")
      })
    })
  })
})
