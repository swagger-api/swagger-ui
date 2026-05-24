/**
 * @prettier
 */

describe("Operation parameters with schema and union type", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/oas31-parameter-schema.yaml")
  })

  it("should render example for parameters with union type including object", () => {
    cy.get(".opblock-summary-path span").contains("/objectTypeUnion").click()
    cy.get(".model-example textarea")
      .should("exist")
      .and("have.value", '{\n  "id": "string",\n  "name": "string"\n}')
  })

  it("should render schema for parameters with union type including object", () => {
    cy.get(".opblock-summary-path span").contains("/objectTypeUnion").click()

    cy.get(".model-example button").contains("Schema").click()
    cy.get(".model-example .json-schema-2020-12").should("exist")
  })

  it("should render example for parameters with union type including array of objects", () => {
    cy.get(".opblock-summary-path span").contains("/arrayTypeUnion").click()

    cy.get(".model-example textarea")
      .should("exist")
      .and(
        "have.value",
        '[\n  {\n    "id": "string",\n    "name": "string"\n  }\n]'
      )
  })

  it("should render schema for parameters with union type including array of objects", () => {
    cy.get(".opblock-summary-path span").contains("/arrayTypeUnion").click()

    cy.get(".model-example button").contains("Schema").click()
    cy.get(".model-example .json-schema-2020-12").should("exist")
  })

  it("should render example for parameters of type array with union type of items including object", () => {
    cy.get(".opblock-summary-path span").contains("/arrayItemTypeUnion").click()

    cy.get(".model-example textarea")
      .should("exist")
      .and("have.value", '{\n  "id": "string",\n  "name": "string"\n}')
  })

  it("should render schema for parameters of type array with union type of items including object", () => {
    cy.get(".opblock-summary-path span").contains("/arrayItemTypeUnion").click()

    cy.get(".model-example button").contains("Schema").click()
    cy.get(".model-example .json-schema-2020-12").should("exist")
  })

  it("should render example for parameters with union type including array and union type of items including object", () => {
    cy.get(".opblock-summary-path span")
      .contains("/arrayTypeAndItemTypeUnion")
      .click()

    cy.get(".model-example textarea")
      .should("exist")
      .and(
        "have.value",
        '[\n  {\n    "id": "string",\n    "name": "string"\n  }\n]'
      )
  })

  it("should render example for parameters with union type including array and union type of items including object", () => {
    cy.get(".opblock-summary-path span")
      .contains("/arrayTypeAndItemTypeUnion")
      .click()

    cy.get(".model-example button").contains("Schema").click()
    cy.get(".model-example .json-schema-2020-12").should("exist")
  })
})
