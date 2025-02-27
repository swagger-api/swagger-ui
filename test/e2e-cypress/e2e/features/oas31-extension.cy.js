/**
 * @prettier
 */

const showsExtensions = (keyword) => {
  it("extensions are visible on keyword click", () => {
    cy.get(".json-schema-2020-12-json-viewer__name")
      .contains("x-primitiveExtension")
      .should("not.be.visible")
    cy.get(".json-schema-2020-12-json-viewer__name")
      .contains("x-arrayExtension")
      .should("not.be.visible")
    cy.get(".json-schema-2020-12-json-viewer__name")
      .contains("x-objectExtension")
      .should("not.be.visible")

    cy.get(".json-schema-2020-12-keyword__name").contains(keyword).click()

    cy.get(".json-schema-2020-12-json-viewer__name")
      .contains("x-primitiveExtension")
      .should("be.visible")
    cy.get(".json-schema-2020-12-json-viewer__name")
      .contains("x-arrayExtension")
      .should("be.visible")
    cy.get(".json-schema-2020-12-json-viewer__name")
      .contains("x-objectExtension")
      .should("be.visible")
  })
}

describe("OpenAPI 3.1 extension keyword", () => {
  describe("displays extensions", () => {
    beforeEach(() => {
      cy.visit(
        "/?url=/documents/features/oas31-extension.yaml&showExtensions=true"
      )
    })

    describe("Discriminator extension", () => {
      beforeEach(() => {
        cy.get(".json-schema-2020-12").contains("My Pet").click()
      })
      showsExtensions("Discriminator")
    })

    describe("External documentation extension", () => {
      beforeEach(() => {
        cy.get(".json-schema-2020-12").contains("Object").click()
      })
      showsExtensions("External documentation")
    })

    describe("XML extension", () => {
      beforeEach(() => {
        cy.get(".json-schema-2020-12").contains("Book").click()
      })
      showsExtensions("XML")
    })
  })

  it("should hide extensions if showExtensions option is set to false", () => {
    cy.visit(
      "/?url=/documents/features/oas31-extension.yaml&showExtensions=false"
    )
    cy.get(".json-schema-2020-12").contains("Object").click()
    cy.get(".json-schema-2020-12-keyword__name")
      .contains("External documentation")
      .click()

    cy.get(".json-schema-2020-12-keyword__name--secondary")
      .contains("url")
      .should("be.visible")

    cy.contains("x-primitiveExtension").should("not.exist")
    cy.contains("x-arrayExtension").should("not.exist")
    cy.contains("x-objectExtension").should("not.exist")
  })
})
