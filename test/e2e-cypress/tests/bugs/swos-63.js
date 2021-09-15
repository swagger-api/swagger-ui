describe("SWOS-63: Schema/Model labeling", () => {
  describe("SchemaS/Models section", () => {
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
  describe("ModelExample within Operation", () => {
    it("should render `Schemas` for OpenAPI 3", () => {
      cy
        .visit("/?url=/documents/petstore-expanded.openapi.yaml")
        .get("#operations-default-findPets")
        .click()
        .get("button.tablinks[data-name=model]")
        .contains("Schema")
    })
    it("should render `Models` for OpenAPI 2", () => {
      cy
        .visit("/?url=/documents/petstore.swagger.yaml")
        .get("section.models > h4")
        .get("#operations-pet-addPet")
        .click()
        .get("button.tablinks[data-name=model]")
        .contains("Model")
    })
  })
})
