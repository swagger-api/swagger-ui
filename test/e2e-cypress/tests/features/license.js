describe("Render License", () => {
  describe("OpenAPI 2", () =>{
    const baseUrl = "/?url=/documents/features/license-openAPI2.yaml"
    it("should render License URL", () => {
      cy.visit(baseUrl)
        .get(".info__license")
        .should("exist")
        .should("contains.text", "Apache 2.0")
        .should("not.contains.text", "SPDX License")
        .get(".info__license__identifier")
        .should("not.exist")
    })
    it("should render License URL anchor target xss link with safe `rel` attributes ", () => {
      cy.visit(baseUrl)
        .get(".info__license > .link")
        .should("have.attr", "rel")
        .and("include", "noopener")
        .and("include", "noreferrer")
        .get(".info .main > a")
        .should("have.attr", "target")
        .and("equal", "_blank")
    })
  })
  describe("OpenAPI 3.0.x", () => {
    const baseUrl = "/?url=/documents/features/license-openAPI30.yaml"
    it("should render License URL", () => {
      cy.visit(baseUrl)
        .get(".info__license__url")
        .should("exist")
        .should("contains.text", "Apache 2.0")
        .should("not.contains.text", "SPDX License")
        .get(".info__license__identifier")
        .should("not.exist")
     })
    it("should render URL anchor target xss link with safe `rel` attributes ", () => {
      cy.visit(baseUrl)
        .get(".info__license__url > a")
        .should("have.attr", "rel")
        .and("include", "noopener")
        .and("include", "noreferrer")
        .get(".info .main > a")
        .should("have.attr", "target")
        .and("equal", "_blank")
    })
  })
  describe("OpenAPI 3.1.x", () => { 
    describe("only URL", () => {
      const baseUrl = "/?url=/documents/features/license-openAPI31-url.yaml"
      it("should render URL", () => {
        cy.visit(baseUrl)
          .get(".info__license__url")
          .should("exist")
          .should("contains.text", "Apache 2.0")
          .should("not.contains.text", "SPDX License")
          .get(".info__license__identifier")
          .should("not.exist")
       })
      it("should render URL anchor target xss link with safe `rel` attributes ", () => {
        cy.visit(baseUrl)
          .get(".info__license__url > a")
          .should("have.attr", "rel")
          .and("include", "noopener")
          .and("include", "noreferrer")
          .get(".info .main > a")
          .should("have.attr", "target")
          .and("equal", "_blank")
      })
    })
    describe("only SPDX Identifier", () => {
      const baseUrl = "/?url=/documents/features/license-openAPI31-identifier.yaml"
      it("should render SPDX Identifier", () => {
        cy.visit(baseUrl)
          .get(".info__license__identifier")
          .should("exist")
          .should("contains.text", "Apache-2.0")
          .should("contains.text", "SPDX License")
          .get(".info__license__url")
          .should("not.exist")
       })
      it("should render SPDX and Identifier anchor target xss links with safe `rel` attributes ", () => {
        cy.visit(baseUrl)
          .get(".info__license__identifier > a")
          .each(($el) => {
            cy.get($el)
              .should("have.attr", "rel")
              .and("include", "noopener")
              .and("include", "noreferrer")
            cy.get($el)
              .should("have.attr", "target")
              .and("equal", "_blank")
          })
      })
    })
    describe("URL and SPX are mutually exclusive", () => {
      it("should render nothing if both URL & SPDX exists", () => {
        const baseUrl = "/?url=/documents/features/license-openAPI31-error-both-identifier-and-url.yaml"
        cy.visit(baseUrl)
          .get(".info__license__identifier")
          .should("not.exist")
          .get(".info__license__url")
          .should("not.exist")
       })
    })
  })
})
