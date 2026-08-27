/**
 * @prettier
 */
// https://github.com/swagger-api/swagger-ui/issues/5667
// Path-level (a.k.a. "global") parameters defined on a path item should
// merge into every operation under that path, even when the path item
// itself was reached through a cross-file $ref.

describe("#5667: Global parameters not visible when referenced through other definition", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/bugs/5667-root.yaml")
  })

  it("should render the path-level parameter on an operation that declares no parameters of its own (options)", () => {
    cy.get("#operations-pets-optionsPetById").click()

    cy.get("#operations-pets-optionsPetById")
      .find("table.parameters .parameter__name")
      .should("contain.text", "petId")
  })

  it("should render the path-level parameter on a sibling operation (get) too", () => {
    cy.get("#operations-pets-showPetById").click()

    cy.get("#operations-pets-showPetById")
      .find("table.parameters .parameter__name")
      .should("contain.text", "petId")
  })
})
