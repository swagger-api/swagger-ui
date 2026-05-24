/**
 * @prettier
 */
describe("Render Contact and License in OAS 3.2.0", () => {
  const baseUrl = "/?url=/documents/oas32/contact-and-license.yaml"

  it("should render contact with all fields", () => {
    cy.visit(baseUrl)
      .get(".info__contact")
      .should("exist")
      .find("a")
      .first()
      .should("contain.text", "API Support Team")
      .should("have.attr", "href", "https://www.example.com/support")
      .should("have.attr", "rel")
      .and("include", "noopener")
  })

  it("should render license with all fields", () => {
    cy.visit(baseUrl)
      .get(".info__license")
      .should("exist")
      .get(".info__license__url")
      .should("contain.text", "Apache 2.0")
      .find("a")
      .should(
        "have.attr",
        "href",
        "https://www.apache.org/licenses/LICENSE-2.0.html"
      )
      .should("have.attr", "rel")
      .and("include", "noopener")
  })
})
