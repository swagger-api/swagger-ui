/**
 * @prettier
 */
describe("JSON Schema 2020-12 examples keyword", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/json-schema-2020-12-examples.yaml")
  })

  it("should render `Examples` section", () => {
    cy.get(".json-schema-2020-12-accordion").click()
    cy.get(".json-schema-2020-12-keyword--examples").should("exist")
  })

  it("should render primitive examples value", () => {
    cy.get(".json-schema-2020-12-accordion").click()
    cy.contains("Examples").click()

    cy.get(".json-schema-2020-12-keyword--examples")
      .contains("#0")
      .as("primitiveExample")
      .should("exist")

    cy.get("@primitiveExample")
      .siblings(".json-schema-2020-12-json-viewer__value")
      .contains("1")
      .should("exist")
  })

  it("should render array examples value", () => {
    cy.get(".json-schema-2020-12-accordion").click()
    cy.contains("Examples").click()

    cy.get(".json-schema-2020-12-keyword--examples")
      .contains("#1")
      .as("arrayExample")
      .should("exist")

    cy.get("@arrayExample").click()

    cy.get("@arrayExample")
      .parent()
      .contains("#0")
      .as("arrayExampleItem")
      .should("exist")

    cy.get("@arrayExampleItem")
      .siblings(".json-schema-2020-12-json-viewer__value")
      .contains("2")
      .should("exist")
  })

  it("should render object examples values", () => {
    cy.get(".json-schema-2020-12-accordion").click()
    cy.contains("Examples").click()

    cy.get(".json-schema-2020-12-keyword--examples")
      .contains("#2")
      .as("objectExample")
      .should("exist")

    cy.get("@objectExample").click()

    cy.get("@objectExample")
      .parent()
      .contains("prop")
      .as("objectExampleProperty")
      .should("exist")

    cy.get("@objectExampleProperty")
      .siblings(".json-schema-2020-12-json-viewer__value")
      .contains("3")
      .should("exist")
  })
})
