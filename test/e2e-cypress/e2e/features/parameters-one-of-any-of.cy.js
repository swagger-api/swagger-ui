/**
 * @prettier
 */

describe("Parameter with oneOf and anyOf keywords in OpenAPI 3.0.x", () => {
  it("should render correct form fields", () => {
    cy.visit("/?url=/documents/features/parameters-one-of-any-of-oas3.yaml")
      .get("#operations-default-get_")
      .click()
    cy.get(".parameters-col_description")
      .eq(1)
      .find("select")
      .should("exist")
      .and("have.value", "ascending")
    cy.get(".parameters-col_description")
      .eq(2)
      .find("input")
      .should("exist")
      .and("have.value", "test")
    cy.get(".parameters-col_description")
      .eq(3)
      .find("textarea")
      .should("exist")
      .and("contain", "\"eq\": \"active\"")
  })
})

describe("Parameter with oneOf and anyOf keywords in OpenAPI 3.1.0.", () => {
  it("should render correct form fields", () => {
    cy.visit("/?url=/documents/features/parameters-one-of-any-of-oas31.yaml")
      .get("#operations-default-get_")
      .click()
    cy.get(".parameters-col_description")
      .eq(1)
      .find("select")
      .should("exist")
      .and("have.value", "ascending")
    cy.get(".parameters-col_description")
      .eq(2)
      .find("input")
      .should("exist")
      .and("have.value", "test")
    cy.get(".parameters-col_description")
      .eq(3)
      .find("textarea")
      .should("exist")
      .and("contain", "\"eq\": \"active\"")
  })
})
