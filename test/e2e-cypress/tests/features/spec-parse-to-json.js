/**
 * @prettier
 */

describe("Parse YAML as YAML@1.2 with json_schema for all JSON-supported types", () => {
  it("should have date string even without quotes", () => {
    cy.visit("/?url=/documents/features/spec-parse-to-json.yaml")
      .get("#operations-default-get_foo")
      .click()
      // Responses -> example value tab
      .get(".language-json > :nth-child(3)")
      .should("have.text", "\"without-quotes\"")
      .get(".language-json > :nth-child(5)")
      .should("have.text", "\"1999-11-31\"")
      // Responses -> schema tab
      .get(".model-example > .tab > :nth-child(2)")
      .click()
      .get(":nth-child(1) > :nth-child(2) > .model > :nth-child(1) > .prop > .property") // first element, without-quotes
      .should("have.text", "example: 1999-11-31")
      .get(":nth-child(2) > :nth-child(2) > .model > :nth-child(1) > .prop > .property") // second element, with quotes
      .should("have.text", "example: 1999-12-31")
  })
})
