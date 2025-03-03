/**
 * @prettier
 */

describe("OpenAPI 3.1.0 file upload", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/oas31-file-upload.yaml")
  })

  it("should render file input when contentMediaType of request body schema is application/octet-stream", () => {
    cy.get(".opblock-summary-path span")
      .contains("/requestBody-contentMediaType")
      .click()
    cy.contains("Try it out").click()
    cy.get(".opblock-description-wrapper input[type=file]").should("exist")
  })

  it("should render file input when contentEncoding of request body schema is base64", () => {
    cy.get(".opblock-summary-path span")
      .contains("/requestBody-contentEncoding")
      .click()
    cy.contains("Try it out").click()
    cy.get(".opblock-description-wrapper input[type=file]").should("exist")
  })

  it("should render file input when Media Type Object for file upload is empty", () => {
    cy.get(".opblock-summary-path span")
      .contains("/requestBody-noSchema")
      .click()
    cy.contains("Try it out").click()
    cy.get(".opblock-description-wrapper input[type=file]").should("exist")
  })

  it("should render file input when contentMediaType of a parameter schema is application/octet-stream", () => {
    cy.get(".opblock-summary-path span")
      .contains("/parameter-contentMediaType")
      .click()
    cy.contains("Try it out").click()
    cy.get(".parameters-col_description input[type=file]").should("exist")
  })

  it("should render file input when contentEncoding of a parameter schema is base64", () => {
    cy.get(".opblock-summary-path span")
      .contains("/parameter-contentEncoding")
      .click()
    cy.contains("Try it out").click()
    cy.get(".parameters-col_description input[type=file]").should("exist")
  })

  it("should render file input when contentMediaType of a multipart/form-data object property is application/octet-stream", () => {
    cy.get(".opblock-summary-path span")
      .contains("/property-contentMediaType")
      .click()
    cy.contains("Try it out").click()
    cy.get(".opblock-description-wrapper input[type=file]").should("exist")
  })

  it("should render file input when contentEncoding of a multipart/form-data object property is base64", () => {
    cy.get(".opblock-summary-path span")
      .contains("/property-contentEncoding")
      .click()
    cy.contains("Try it out").click()
    cy.get(".opblock-description-wrapper input[type=file]").should("exist")
  })
})
