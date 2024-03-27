describe("#6540: XML example not rendered correctly with oneOf", () => {
  it("should render xml like json", () => {
    const expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test>\n\t<a>string</a>\n\t<b>0</b>\n\t<c>\n\t\t<ObjectType>Text</ObjectType>\n\t\t<Data>This is a text</Data>\n\t</c>\n\t<c>\n\t\t<ObjectType>image</ObjectType>\n\t\t<Data>This is a image</Data>\n\t</c>\n\t<d>\n\t\t<ObjectType>Text</ObjectType>\n\t\t<Data>This is a text</Data>\n\t</d>\n\t<d>\n\t\t<ObjectType>image</ObjectType>\n\t\t<Data>This is a image</Data>\n\t</d>\n</test>"
    cy
      .visit("/?url=/documents/bugs/6540.yaml")
      .get("#operations-Test-postTest")
      .click()
      .get(".microlight")
      .contains(expected)
  })
})
