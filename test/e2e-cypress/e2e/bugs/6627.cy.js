describe("#6627: XML example when defined as array", () => {
  it("should render xml like json", () => {
    const expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Users>\n\t<User id=\"123\" name=\"bob\">\n\t</User>\n\t<User id=\"456\" name=\"jane\">\n\t</User>\n</Users>"
    cy
      .visit("/?url=/documents/bugs/6627.yaml")
      .get("#operations-default-get_users")
      .click()
      .get(".microlight")
      .contains(expected)
  })
})
