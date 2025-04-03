describe("#4838: empty request bodies result in endless loading", () => {
  it("should render model content changes correctly", () => {
    cy
      .visit("/?url=/documents/bugs/4838.yaml")
      .get("#operations-Some-post_some_route")
      .click()
      .contains("This should be visible")
  })
})
