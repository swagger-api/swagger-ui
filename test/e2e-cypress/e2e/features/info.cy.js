describe("Render Info Component", () => {
  describe("OpenAPI 2.0", () => {
    const baseUrl = "/?url=/documents/features/info-openAPI2.yaml"

    it("should render Info Description", () => {
      cy.visit(baseUrl)
        .get(".info .description")
        .should("contains.text", "This is a sample")
    })

    it("should render Info Main anchor target xss link with safe `rel` attributes", () => {
      cy.visit(baseUrl)
        .get(".info .main > a")
        .should("have.attr", "rel")
        .and("include", "noopener")
        .and("include", "noreferrer")
        .get(".info .main > a")
        .should("have.attr", "target")
        .and("equal", "_blank")
    })

    it("should not render Info Summary (an OpenAPI 3.1 field)", () => {
      cy.visit(baseUrl)
        .get(".info__summary")
        .should("not.exist")
    })
  })

  describe("OpenAPI 3.0.x", () => {
    const baseUrl = "/?url=/documents/features/info-openAPI30.yaml"

    it("should render Info Description", () => {
      cy.visit(baseUrl)
        .get(".info .description")
        .should("contains.text", "This is a sample")
    })

    it("should render Info Main anchor target xss link with safe `rel` attributes", () => {
      cy.visit(baseUrl)
        .get(".info .main > a")
        .should("have.attr", "rel")
        .and("include", "noopener")
        .and("include", "noreferrer")
        .get(".info .main > a")
        .should("have.attr", "target")
        .and("equal", "_blank")
    })

    it("should not render Info Summary (an OpenAPI 3.1 field)", () => {
      cy.visit(baseUrl)
        .get(".info__summary")
        .should("not.exist")
    })
  })

  describe("OpenAPI 3.1.x", () => {
    const baseUrl = "/?url=/documents/features/info-openAPI31.yaml"

    it("should render Info Description", () => {
      cy.visit(baseUrl)
        .get(".info .description")
        .should("contains.text", "This is a sample")
    })

    it("should render Info Main anchor target xss link with safe `rel` attributes", () => {
      cy.visit(baseUrl)
        .get(".info .main > a")
        .should("have.attr", "rel")
        .and("include", "noopener")
        .and("include", "noreferrer")
        .get(".info .main > a")
        .should("have.attr", "target")
        .and("equal", "_blank")
    })
    it("should render Info Summary", () => {
      cy.visit(baseUrl)
        .get(".info__summary")
        .should("exist")
        .should("contains.text", "new 3.1.x specific field")
        .get(".info .description")
        .should("contains.text", "This is a sample")
    })
  })
})
