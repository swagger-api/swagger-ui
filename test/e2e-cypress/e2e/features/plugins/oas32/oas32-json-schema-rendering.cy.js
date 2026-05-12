/**
 * @prettier
 */

describe("OpenAPI 3.2 JSON Schema 2020-12 rendering", () => {
  const baseUrl = "/?url=/documents/features/oas32-json-schema-rendering.yaml"

  describe("Schemas section", () => {
    beforeEach(() => {
      cy.visit(baseUrl)
    })

    it("should render the schemas section using JSON Schema 2020-12", () => {
      cy.get(".json-schema-2020-12").should("exist")
    })

    it("should render schema properties with JSON Schema 2020-12 property classes", () => {
      cy.get(".json-schema-2020-12").contains("My Pet").click()
      cy.get(".json-schema-2020-12-property").contains("id").should("exist")
      cy.get(".json-schema-2020-12-property").contains("name").should("exist")
    })

    it("should render the schema description keyword", () => {
      cy.get(".json-schema-2020-12").contains("My Pet").click()
      cy.get(".json-schema-2020-12-keyword--description")
        .should("exist")
        .and("contain.text", "A pet in the system")
    })

    it("should render the Discriminator keyword", () => {
      cy.get(".json-schema-2020-12").contains("My Pet").click()
      cy.get(".json-schema-2020-12-keyword__name")
        .contains("Discriminator")
        .should("exist")
    })

    it("should render the External documentation keyword", () => {
      cy.get(".json-schema-2020-12").contains("My Pet").click()
      cy.get(".json-schema-2020-12-keyword__name")
        .contains("External documentation")
        .should("exist")
    })

    it("should render the XML keyword", () => {
      cy.get(".json-schema-2020-12").contains("My Pet").click()
      cy.get(".json-schema-2020-12-keyword--xml").should("exist")
    })

    it("should render the Examples keyword", () => {
      cy.get(".json-schema-2020-12").contains("My Pet").click()
      cy.get(".json-schema-2020-12-keyword--examples").should("exist")
    })
  })

  describe("Request body schema", () => {
    beforeEach(() => {
      cy.visit(baseUrl)
      cy.get(".opblock-summary-path span").contains("/pets").click()
      cy.get("button").contains("Try it out").click()
    })

    it("should render request body schema using JSON Schema 2020-12", () => {
      cy.get(".model-example button").contains("Schema").click()
      cy.get(".model-example .json-schema-2020-12").should("exist")
    })

    it("should render example for properties with union type including object", () => {
      cy.get(".model-example textarea")
        .should("exist")
        .and(
          "have.value",
          '{\n  "objectTypeUnion": {\n    "id": "string",\n    "name": "string"\n  }\n}'
        )
    })
  })
})
