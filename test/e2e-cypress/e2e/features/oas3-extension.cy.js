/**
 * @prettier
 */

describe("OpenAPI 3.0 extensions", () => {
  describe("displays extensions", () => {
    beforeEach(() => {
      cy.visit(
        "/?url=/documents/features/oas3-extension.yaml&showExtensions=true"
      )

      cy.get(".model-box-control").contains("User").click()
      cy.get(".property-row").contains("[...]").click()
    })

    it("object extensions are visible", () => {
      cy.get(".extension").contains(`x-object-extension`).should("be.visible")
      cy.get(".extension")
        .contains(`x-object-objectExtension`)
        .should("be.visible")
    })

    it("primitive extensions are visible", () => {
      cy.get(".extension")
        .contains(`x-primitive-extension`)
        .should("be.visible")
      cy.get(".extension")
        .contains(`x-primitive-objectExtension`)
        .should("be.visible")
    })
  })

  it("should hide extensions if showExtensions option is set to false", () => {
    cy.visit("/?url=/documents/features/oas3-extension.yaml")
    cy.get(".model-box-control").contains("User").click()
    cy.get(".property-row").contains("[...]").click()

    cy.contains("x-primitive-extension").should("not.exist")
    cy.contains("x-primitive-objectExtension").should("not.exist")
    cy.contains("x-object-extension").should("not.exist")
    cy.contains("x-object-objectExtension").should("not.exist")
  })
})
