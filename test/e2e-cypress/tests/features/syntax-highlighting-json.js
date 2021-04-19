/**
 * @prettier
 */
describe("Syntax Highlighting for JSON content", () => {
  // expect span contains entire string sample
  // fail case is if the string sample gets broken up into segments
  // due syntax highlighting attempting to escape characters
  describe("OAS 2", () => {
    it("param body: should use json language if content is json", () => {
      cy.visit("/?url=/documents/features/syntax-highlighting-json-oas2.yaml")
      .get("#operations-default-post_setServices")
      .click()
      .get(".body-param__example > .language-json > :nth-child(10)")
      .should("have.text", "\"79daf5b4-aa4b-1452-eae5-42c231477ba7\"")
    })
    it("response: should use json language if content is json", () => {
      cy.visit("/?url=/documents/features/syntax-highlighting-json-oas2.yaml")
      .get("#operations-default-post_setServices")
      .click()
      .get(".example > .language-json > :nth-child(28)")
        .should("have.text", "\"5ff06f632bb165394501b05d3a833355\"") // span contains entire long string
    })
  })
})
