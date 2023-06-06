/**
 * @prettier
 */
describe("Render License Component", () => {
  describe("OpenAPI 2.0", () => {
    const baseUrl = "/?url=/documents/features/license-openAPI2.yaml"

    it("should render License URL", () => {
      cy.visit(baseUrl)
        .get(".info__license")
        .should("exist")
        .should("contains.text", "Apache 2.0")
    })

    it("should render License URL anchor target xss link with safe `rel` attributes", () => {
      cy.visit(baseUrl)
        .get(".info__license__url > .link")
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
    })

    it("should render URL anchor target xss link with safe `rel` attributes", () => {
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
    describe("given URL field", () => {
      const baseUrl = "/?url=/documents/features/license-openAPI31-url.yaml"

      it("should render URL", () => {
        cy.visit(baseUrl)
          .get(".info__license__url")
          .should("exist")
          .should("contains.text", "Apache 2.0")
          .get(".info__license__url > a")
          .should("have.attr", "href")
          .and("equal", "https://www.apache.org/licenses/LICENSE-2.0.html")
      })

      it("should render URL anchor target xss link with safe `rel` attributes", () => {
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

    describe("given identifier field", () => {
      const baseUrl =
        "/?url=/documents/features/license-openAPI31-identifier.yaml"

      it("should render URL using identifier", () => {
        cy.visit(baseUrl)
          .get(".info__license__url")
          .should("exist")
          .should("contains.text", "Apache 2.0")
          .get(".info__license__url > a")
          .should("have.attr", "href")
          .and("equal", "https://spdx.org/licenses/Apache-2.0.html")
      })

      it("should render URL anchor target xss links with safe `rel` attributes", () => {
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

    describe("URL and SPX are mutually exclusive", () => {
      it("should render nothing if both URL & SPDX exists", () => {
        const baseUrl =
          "/?url=/documents/features/license-openAPI31-error-both-identifier-and-url.yaml"
        cy.visit(baseUrl)
          .get(".info__license__identifier")
          .should("not.exist")
          .get(".info__license__url")
          .should("not.exist")
      })
    })
  })
})
