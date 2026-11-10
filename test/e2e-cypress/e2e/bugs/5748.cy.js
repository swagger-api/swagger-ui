/**
 * @prettier
 */

// https://github.com/swagger-api/swagger-ui/issues/5748

describe("#5748: schema property `example: $ref` to a components.examples entry", () => {
  it("renders the referenced Example Object's value without the `value:` wrapper", () => {
    cy.visit("/?url=/documents/bugs/5748.yaml")
      .get("#operations-default-getFirst")
      .click()
      .get(".model-example .highlight-code")
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Individual")
        expect(text).to.include("Variant")
        expect(text).to.include("ga4gh-phenopacket-individual-v0.1")
        expect(text).not.to.match(/"value"\s*:/)
      })
  })
})
