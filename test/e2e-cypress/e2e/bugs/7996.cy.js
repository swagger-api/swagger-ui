describe("#7996: tag description text fills container when externalDocs section absent", () => {
  it("should show externalDocs div when externalDocs present in specification", () => {
    cy
      .visit("?url=/documents/bugs/7996-tags-externalDocs.yaml")
      .get("#operations-tag-foo .info__externaldocs")
      .should("exist")
  })
  it("should have no externalDocs div when externalDocs absent from specification", () => {
    cy
      .visit("?url=/documents/bugs/7996-tags-externalDocs.yaml")
      .get("#operations-tag-bar .info__externaldocs")
      .should("not.exist")
  })
})
