describe("#6475: 'Examples' keyword definitions can not be rendered as xml", () => {
  it("should render requestBody examples preview accourdingly to content-type xml", () => {
    const xmlIndicator = "<x>should be xml</x>"

    cy
      .visit("?url=/documents/bugs/6475.yaml")
      .get("#operations-default-xmlTest_examples")
      .click()
      .get(".opblock-section-request-body")
      .within(() => {
        cy
          .get(".microlight")
          .should("include.text", xmlIndicator)
      })
  })
  it("should requestBody examples input accourdingly to content-type xml", () => {
    const xmlIndicator = "<x>should be xml</x>"

    cy
      .visit("?url=/documents/bugs/6475.yaml")
      .get("#operations-default-xmlTest_examples")
      .click()
      .get(".btn.try-out__btn")
      .click()
      .get(".opblock-section-request-body")
      .within(() => {
        cy
          .get("textarea")
          .contains(xmlIndicator)
      })
  })
})

describe("#6475: 'Example' keyword definitions can not be rendered as xml", () => {
  it("should render requestBody examples preview accourdingly to content-type xml", () => {
    const xmlIndicator = "<x>should be xml</x>"

    cy
      .visit("?url=/documents/bugs/6475.yaml")
      .get("#operations-default-xmlTest_example")
      .click()
      .get(".opblock-section-request-body")
      .within(() => {
        cy
          .get(".microlight")
          .should("include.text", xmlIndicator)
      })
  })
  it("should requestBody examples input accourdingly to content-type xml", () => {
    const xmlIndicator = "<x>should be xml</x>"

    cy
      .visit("?url=/documents/bugs/6475.yaml")
      .get("#operations-default-xmlTest_example")
      .click()
      .get(".btn.try-out__btn")
      .click()
      .get(".opblock-section-request-body")
      .within(() => {
        cy
          .get("textarea")
          .contains(xmlIndicator)
      })
  })
})
