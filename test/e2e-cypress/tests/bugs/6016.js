describe("Entries should be valid property name", () => {
  it("should render a OAS3.0 definition that uses 'entries' as a 'components' property name", () => {
    cy.visit("/?url=/documents/bugs/6016-oas3.yaml")
      .get("#operations-tag-default")
      .should("exist")
  })
  it("should render expanded Operations of OAS3.0 definition that uses 'entries' as a 'components' property name", () => {
    cy.visit("/?url=/documents/bugs/6016-oas3.yaml")
      .get("#operations-default-test_test__get")
      .click()
      .get("#operations-default-test_test__get > div .opblock-body")
      .should("exist")

  })
  it("should render expanded Models of OAS3.0 definition that uses 'entries' as a 'components' property name", () => {
    cy.visit("/?url=/documents/bugs/6016-oas3.yaml")
      .get("#model-Testmodel > span .model-box")
      .click()
      .get("div .model-box")
      .should("exist")
  })
  it("should render a OAS2.0 definition that uses 'entries' as a 'definitions' property name", () => {
    cy.visit("/?url=/documents/bugs/6016-oas2.yaml")
      .get("#operations-default-post_pet")
      .should("exist")
  })
  it("should render expanded Operations of OAS2.0 definition that uses 'entries' as a 'definitions' property name", () => {
    cy.visit("/?url=/documents/bugs/6016-oas2.yaml")
      .get("#operations-default-post_pet")
      .click()
      .get("#operations-default-post_pet > div .opblock-body")
      .should("exist")

  })
  it("should render expanded Models of OAS2.0 definition that uses 'entries' as a 'defintions' property name", () => {
    cy.visit("/?url=/documents/bugs/6016-oas2.yaml")
      .get("#model-Pet > span .model-box")
      .click()
      .get("div .model-box")
      .should("exist")
  })
})
