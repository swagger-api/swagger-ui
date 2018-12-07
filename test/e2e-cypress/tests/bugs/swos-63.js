describe("SWOS-63: Schema/Model section labeling", () => {
  it("should render `Schemas` for OpenAPI 3", () => {
    cy
      .visit("/?url=/documents/petstore-expanded.openapi.yaml")
      .get("section.models > h4")
      .contains("Schemas")
  })
  it("should render `Models` for OpenAPI 2", () => {
    cy
      .visit("/?url=/documents/petstore.swagger.yaml")
      .get("section.models > h4")
      .contains("Models")
  })
})
