/**
 * @prettier
 */

describe("JSON Schema 2020-12 extension keywords", () => {
  describe("display extension keywords", () => {
    beforeEach(() => {
      cy.visit(
        "/?url=/documents/features/json-schema-2020-12-extension-keywords.yaml&showExtensions=true"
      )
    })

    it("should render `Extension Keywords` section", () => {
      cy.get(".json-schema-2020-12-accordion").click()
      cy.get(".json-schema-2020-12-keyword--extension-keywords").should("exist")
    })

    it("should render extension keywords with primitive values", () => {
      cy.get(".json-schema-2020-12-accordion").click()
      cy.contains("Extension Keywords").click()

      cy.get(".json-schema-2020-12-json-viewer-extension-keyword")
        .contains("primitiveExtension")
        .as("primitiveExtension")
        .should("exist")

      cy.get("@primitiveExtension")
        .siblings(".json-schema-2020-12-json-viewer__value")
        .contains("1")
        .should("exist")
    })

    it("should render extension keywords with array values", () => {
      cy.get(".json-schema-2020-12-accordion").click()
      cy.contains("Extension Keywords").click()

      cy.get(".json-schema-2020-12-json-viewer-extension-keyword")
        .contains("arrayExtension")
        .should("exist")

      cy.contains("arrayExtension").click()

      cy.get(".json-schema-2020-12-json-viewer__children")
        .contains("#0")
        .as("arrayExtensionItem")
        .should("exist")

      cy.get("@arrayExtensionItem")
        .siblings(".json-schema-2020-12-json-viewer__value")
        .contains("2")
        .should("exist")
    })

    it("should render extension keywords with object values", () => {
      cy.get(".json-schema-2020-12-accordion").click()
      cy.contains("Extension Keywords").click()

      cy.get(".json-schema-2020-12-json-viewer-extension-keyword")
        .contains("objectExtension")
        .should("exist")

      cy.contains("objectExtension").click()

      cy.get(".json-schema-2020-12-json-viewer__children")
        .contains("prop")
        .as("objectExtensionProperty")
        .should("exist")

      cy.get("@objectExtensionProperty")
        .siblings(".json-schema-2020-12-json-viewer__value")
        .contains("3")
        .should("exist")
    })

    it("should not render OpenAPI 3.1.0 keywords as extension keywords", () => {
      cy.get(".json-schema-2020-12-accordion").click()
      cy.contains("Extension Keywords").click()

      cy.get(".json-schema-2020-12-keyword--extension-keywords")
        .children()
        .contains("Default")
        .should("not.exist")
    })
  })

  it("shouldn't display extensions when showExtensions option is set to false", () => {
    cy.visit(
      "/?url=/documents/features/json-schema-2020-12-extension-keywords.yaml"
    )

    cy.get(".json-schema-2020-12-accordion").click()
    cy.contains("Extension Keywords").should("not.exist")
  })
})
