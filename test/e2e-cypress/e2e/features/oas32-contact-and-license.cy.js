/**
 * @prettier
 */
describe("Render Contact and License in OAS 3.2.0", () => {
  const baseUrl = "/?url=/documents/oas32/contact-and-license.yaml"

  describe("Contact Component", () => {
    it("should render contact information", () => {
      cy.visit(baseUrl)
        .get(".info__contact")
        .should("exist")
    })

    it("should render contact name and website link", () => {
      cy.visit(baseUrl)
        .get(".info__contact a")
        .first()
        .should("contain.text", "API Support Team")
        .should("have.attr", "href", "https://www.example.com/support")
        .should("have.attr", "target", "_blank")
    })

    it("should render contact email link", () => {
      cy.visit(baseUrl)
        .get(".info__contact a")
        .last()
        .should("contain.text", "Send email to API Support Team")
        .should("have.attr", "href", "mailto:support@example.com")
    })

    it("should render contact links with safe `rel` attributes", () => {
      cy.visit(baseUrl)
        .get(".info__contact a")
        .first()
        .should("have.attr", "rel")
        .and("include", "noopener")
        .and("include", "noreferrer")
    })
  })

  describe("License Component", () => {
    it("should render license information", () => {
      cy.visit(baseUrl)
        .get(".info__license")
        .should("exist")
    })

    it("should render license name and URL", () => {
      cy.visit(baseUrl)
        .get(".info__license__url")
        .should("exist")
        .should("contain.text", "Apache 2.0")
        .get(".info__license__url > a")
        .should("have.attr", "href", "https://www.apache.org/licenses/LICENSE-2.0.html")
        .should("have.attr", "target", "_blank")
    })

    it("should render license URL with safe `rel` attributes", () => {
      cy.visit(baseUrl)
        .get(".info__license__url > a")
        .should("have.attr", "rel")
        .and("include", "noopener")
        .and("include", "noreferrer")
    })
  })

  describe("OAS Version Badge", () => {
    it("should display OAS 3.2 badge", () => {
      cy.visit(baseUrl)
        .get(".info .version-stamp")
        .contains("OAS 3.2")
        .should("exist")
    })
  })
})
