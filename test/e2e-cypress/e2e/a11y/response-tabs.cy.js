describe("Response tab elements", () => {
  describe("ModelExample within Operation", () => {
    it("should render Example tabpanel by default", () => {
      cy
        .visit("/?url=/documents/petstore-expanded.openapi.yaml")
        .get("#operations-default-addPet")
        .click()
        .get("div[data-name=examplePanel]")
        .first()
        .should("have.attr", "aria-hidden", "false")
    })
    it("should click Schema tab button and render Schema tabpanel for OpenAPI 3", () => {
      cy
        .visit("/?url=/documents/petstore-expanded.openapi.yaml")
        .get("#operations-default-addPet")
        .click()
        .get("button.tablinks[data-name=model]")
        .first()
        .click()
        .get("div[data-name=modelPanel]")
        .first()
        .should("have.attr", "aria-hidden", "false")
    })
    it("should click Model tab button and render Model tabpanel for OpenAPI 2", () => {
      cy
        .visit("/?url=/documents/petstore.swagger.yaml")
        .get("#operations-pet-addPet")
        .click()
        .get("button.tablinks[data-name=model]")
        .click()
        .get("div[data-name=modelPanel]")
        .should("have.attr", "aria-hidden", "false")
    })
  })
})