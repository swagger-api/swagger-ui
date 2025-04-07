/**
 * @prettier
 */

describe("Request body with complex schema properties", () => {
  beforeEach(() => {
    cy.visit(
      "/?url=/documents/features/oas3-request-body-complex-schema-properties.yaml"
    )
  })

  it("should render example for properties of type object", () => {
    cy.get(".opblock-summary-path span").contains("/object").click()
    cy.get("button").contains("Try it out").click()

    cy.get(".model-example textarea")
      .should("exist")
      .and("have.value", '{\n  "id": "string",\n  "name": "string"\n}')
  })

  it("should render schema for properties of type object", () => {
    cy.get(".opblock-summary-path span").contains("/object").click()
    cy.get("button").contains("Try it out").click()

    cy.get(".model-example button").contains("Schema").click()
    cy.get(".model-example .model").should("exist")
  })

  it("should render example for properties of type array of objects", () => {
    cy.get(".opblock-summary-path span").contains("/arrayOfObjects").click()
    cy.get("button").contains("Try it out").click()

    cy.get(".model-example textarea")
      .should("exist")
      .and("have.value", '{\n  "id": "string",\n  "name": "string"\n}')
  })

  it("should render schema for properties of type array of objects", () => {
    cy.get(".opblock-summary-path span").contains("/arrayOfObjects").click()
    cy.get("button").contains("Try it out").click()

    cy.get(".model-example button").contains("Schema").click()
    cy.get(".model-example .model").should("exist")
  })
})
