/**
 * @prettier
 */

describe("Operation parameters", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/parameter-schema.yaml")
  })

  it("should render example for parameters of type object", () => {
    cy.get(".opblock-summary-path span").contains("/object").click()

    cy.get(".model-example textarea")
      .should("exist")
      .and("have.value", '{\n  "id": "string",\n  "name": "string"\n}')
  })

  it("should render schema for parameters of type object", () => {
    cy.get(".opblock-summary-path span").contains("/object").click()

    cy.get(".model-example button").contains("Schema").click()
    cy.get(".model-example .model").should("exist")
  })

  it("should render example for parameters of type array of objects", () => {
    cy.visit("/?url=/documents/features/parameter-schema.yaml")

    cy.get(".opblock-summary-path span").contains("/arrayOfObjects").click()

    cy.get(".model-example textarea")
      .should("exist")
      .and("have.value", '{\n  "id": "string",\n  "name": "string"\n}')
  })

  it("should render schema for parameters of type array of objects", () => {
    cy.get(".opblock-summary-path span").contains("/arrayOfObjects").click()

    cy.get(".model-example button").contains("Schema").click()
    cy.get(".model-example .model").should("exist")
  })
})
