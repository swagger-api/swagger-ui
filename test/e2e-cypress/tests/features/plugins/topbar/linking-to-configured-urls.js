describe("Loading specs by url.primaryName param", () => {
  describe("with no param", () => {
    it("should load the default spec", () => {
      cy.visit("/pages/multiple-urls/index.html")
      .get("span.url")
      .contains("/documents/petstore-expanded.openapi.yaml")
    })
  })
  describe("with an invalid param", () => {
    it("should fall back to the default spec", () => {
      cy.visit("/pages/multiple-urls/index.html?urls.primaryName=undefinedUrlName")
      .get("span.url")
      .contains("/documents/petstore-expanded.openapi.yaml")
    })
  })
  describe("with a valid url.primaryName param", () => {
    it("should render the requested spec", () => {
      cy.visit("/pages/multiple-urls/index.html?urls.primaryName=Petstore Swagger")
      .get("span.url")
      .contains("/documents/petstore.swagger.yaml")
    })
  })
})
