/**
 * @prettier
 */
// https://github.com/swagger-api/swagger-ui/issues/5460

describe("#5460: Displayed example not updated when switching between media types", () => {
  const mediaTypeJson = "application/json"
  const mediaTypeXml = "application/xml"
  const mediaTypePlain = "text/plain"

  beforeEach(() => {
    cy.visit("/?url=/documents/bugs/5460.yaml")
      .get("#operations-default-post_foo")
      .click()
    cy.get(".opblock-section-request-body .content-type").as("selectMediaType")
  })

  it("should update the displayed Example Value when switching from application/json (bar_json) to application/xml", () => {
    cy.get("@selectMediaType").should("have.value", mediaTypeJson)
    cy.get(".opblock-section-request-body .examples-select-element").select(
      "bar_json"
    )
    cy.get(".opblock-section-request-body .body-param__example").should(
      "contain.text",
      "bar"
    )

    cy.get("@selectMediaType").select(mediaTypeXml)
    cy.get(".opblock-section-request-body .body-param__example")
      .should("contain.text", "<")
      .should("not.contain.text", '"bar"')
  })

  it("should display the text/plain example after switching from application/json (bar_json) to text/plain", () => {
    cy.get("@selectMediaType").should("have.value", mediaTypeJson)
    cy.get(".opblock-section-request-body .examples-select-element").select(
      "bar_json"
    )
    cy.get(".opblock-section-request-body .body-param__example").should(
      "contain.text",
      "bar"
    )

    cy.get("@selectMediaType").select(mediaTypePlain)
    cy.get(".opblock-section-request-body .body-param__example")
      .should("contain.text", "Hello, world!")
      .should("not.contain.text", '"bar"')
  })

  it("should reset the Examples dropdown to the first example of the new media type when the previous active example does not exist", () => {
    cy.get(".opblock-section-request-body .examples-select-element").select(
      "bar_json"
    )
    cy.get(".opblock-section-request-body .examples-select-element").should(
      "have.value",
      "bar_json"
    )

    cy.get("@selectMediaType").select(mediaTypeXml)
    cy.get(".opblock-section-request-body .examples-select-element").should(
      "have.value",
      "foo_xml"
    )
  })

  it("should follow the full repro path: json/bar_json -> xml -> text/plain and display each media type's example", () => {
    // Step 3: select bar_json under application/json
    cy.get("@selectMediaType").should("have.value", mediaTypeJson)
    cy.get(".opblock-section-request-body .examples-select-element").select(
      "bar_json"
    )
    cy.get(".opblock-section-request-body .body-param__example").should(
      "contain.text",
      "bar"
    )

    // Step 4: switch to application/xml; Example Value pane must update
    cy.get("@selectMediaType").select(mediaTypeXml)
    cy.get(".opblock-section-request-body .body-param__example").should(
      "contain.text",
      "<"
    )

    // Step 5: switch to text/plain; Example Value pane must update again
    cy.get("@selectMediaType").select(mediaTypePlain)
    cy.get(".opblock-section-request-body .body-param__example")
      .should("contain.text", "Hello, world!")
      .should("not.contain.text", '"bar"')
      .should("not.contain.text", "<foo>")
      .should("not.contain.text", "<bar>")
  })
})
