describe("#6767: Operation should be considered anonymous if its security only includes empty object (this was decided by implementation choice and may change or be extended in the future)", () => {
  it("Should consider method anonymous if security contains only empty object", () => {
    cy
      .visit("/?url=/documents/security/anonymous.yaml")
      .get("#operations-default-get_onlyEmpty .authorization__btn")
      .should("not.exist")
  })

  it("Should consider method as secured if security contains no empty object", () => {
    cy
      .visit("/?url=/documents/security/anonymous.yaml")
      .get("#operations-default-get_required .authorization__btn")
      .should("exist")
  })

  it("Should consider method as secured if security contains empty object but has at least one more security defined", () => {
    cy
      .visit("/?url=/documents/security/anonymous.yaml")
      .get("#operations-default-get_withBoth .authorization__btn")
      .should("exist")
  })
})
