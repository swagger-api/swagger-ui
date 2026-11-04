/**
 * @prettier
 */

describe("#10400: prefixItems generates non-null sample values", () => {
  it("should generate a tuple sample using prefixItems schemas", () => {
    cy.visit("/?url=/documents/bugs/10400.yaml")
      .get("#operations-default-postTuple")
      .click()
      .get(".body-param__example")
      .should("exist")
      .should((el) => {
        const normalized = el.text().replace(/\s+/g, " ")
        expect(normalized).to.contain('"tupleField": [ 0, "string" ]')
      })
  })
})
