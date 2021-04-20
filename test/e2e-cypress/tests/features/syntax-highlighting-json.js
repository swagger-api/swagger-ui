/**
 * @prettier
 */
describe("Syntax Highlighting for JSON value cases", () => {
  // expect span contains entire string sample
  // fail case is if the string sample gets broken up into segments
  // due react-syntax-highlighter attempting to escape characters into multiple segments
  describe("OAS 2", () => {
    it("should render full syntax highlighted string in Request (param body) example", () => {
      cy.visit("/?url=/documents/features/syntax-highlighting-json-oas2.yaml")
      .get("#operations-default-post_setServices")
      .click()
      .get(".body-param__example > .language-json > :nth-child(10)")
      .should("have.text", "\"79daf5b4-aa4b-1452-eae5-42c231477ba7\"")
    })
    it("should render full syntax highlighted string in Response example", () => {
      cy.visit("/?url=/documents/features/syntax-highlighting-json-oas2.yaml")
      .get("#operations-default-post_setServices")
      .click()
      .get(".example > .language-json > :nth-child(28)")
        .should("have.text", "\"5ff06f632bb165394501b05d3a833355\"")
    })
  })
  describe("OAS 3", () => {
    it("should render full syntax highlighted string in Request example", () => {
      cy.visit("/?url=/documents/features/syntax-highlighting-json-oas3.yaml")
        .get("#operations-default-post_setServices")
        .click()
        .get(".body-param__example > .language-json > :nth-child(15)")
        .should("have.text", "\"22a124b4-594b-4452-bdf5-fc3ef1477ba7\"")
    })
    it("should render full syntax highlighted string in Response example", () => {
      cy.visit("/?url=/documents/features/syntax-highlighting-json-oas3.yaml")
        .get("#operations-default-post_setServices")
        .click()
        .get(".example > .language-json > :nth-child(33)")
        .should("have.text", "\"f0009babde9dbe204540d79cf754408e\"")
    })
  })
})
