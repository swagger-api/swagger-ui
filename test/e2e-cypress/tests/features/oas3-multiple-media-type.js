// https://github.com/swagger-api/swagger-ui/issues/6201
// https://github.com/swagger-api/swagger-ui/issues/6250
// https://github.com/swagger-api/swagger-ui/issues/6476

describe("OpenAPI 3.0 Multiple Media Types with different schemas", () => {
  const mediaTypeFormData = "multipart/form-data"
  const mediaTypeUrlencoded = "application/x-www-form-urlencoded"
  const mediaTypeJson = "application/json"

  beforeEach(() => {
    cy.visit(
      "/?url=/documents/features/oas3-multiple-media-type.yaml"
    )
      .get("#operations-default-post_post")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
    // @alias Execute Button
    cy.get(".execute.opblock-control__btn").as("executeBtn")
    // @alias Media Type Dropdown
    cy.get(".opblock-section-request-body .content-type").as("selectMediaType")
  })

  // In all cases,
  // - assume that examples are populated based on schema (not explicitly tested)
  // - assume validation passes based on successful "execute"
  // - expect final cURL command result doees not contain unexpected artifacts from other content-type schemas
  describe("multipart/form-data (only 'bar')", () => {
    it("should execute multipart/form-data", () => {
      cy.get("@selectMediaType")
        .select(mediaTypeUrlencoded)
        .get("@executeBtn")
        .click()
        .get("@selectMediaType")
        .select(mediaTypeFormData)
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "bar")
        .should("not.contains.text", "foo")
    })
    it("should execute application/x-www-form-urlencoded THEN execute multipart/form-data", () => {
      cy.get("@selectMediaType")
        .select(mediaTypeUrlencoded)
        .get("@executeBtn")
        .click()
        .get("@selectMediaType")
        .select(mediaTypeFormData)
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "bar")
        .should("not.contains.text", "foo")
    })
    it("should execute application/json THEN execute multipart/form-data", () => {
      cy.get("@selectMediaType")
        .select(mediaTypeJson)
        .get("@executeBtn")
        .click()
        .get("@selectMediaType")
        .select(mediaTypeFormData)
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "bar")
        .should("not.contains.text", "foo")
    })
  })

  describe("application/x-www-form-urlencoded (only 'foo')", () => {
    it("should execute application/x-www-form-urlencoded", () => {
      cy.get("@selectMediaType")
        .select(mediaTypeUrlencoded)
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "foo")
        .should("not.contains.text", "bar")
    })
    it("should execute multipart/form-data THEN execute application/x-www-form-urlencoded", () => {
      cy.get("@selectMediaType")
        .select(mediaTypeFormData)
        .get("@executeBtn")
        .click()
        .get("@selectMediaType")
        .select(mediaTypeUrlencoded)
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "foo")
        .should("not.contains.text", "bar")
    })
    it("should execute application/json THEN execute application/x-www-form-urlencoded", () => {
      cy.get("@selectMediaType")
        .select(mediaTypeJson)
        .get("@executeBtn")
        .click()
        .get("@selectMediaType")
        .select(mediaTypeUrlencoded)
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "foo")
        .should("not.contains.text", "bar")
    })
  })

  describe("application/json (both 'foo' and 'bar')", () => {
    // note: form input for "application/json" is a string; not multiple form fields
    it("should execute application/json", () => {
      // final curl should have both "bar" and "foo"
      cy.get("@selectMediaType")
        .select(mediaTypeJson)
        .get("@executeBtn")
        .click()
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "foo")
        .should("contains.text", "bar")
    })
    it("should execute multipart/form-data THEN execute application/json", () => {
      cy.get("@selectMediaType")
        .select(mediaTypeFormData)
        .get("@executeBtn")
        .click()
        .get("@selectMediaType")
        .select(mediaTypeJson)
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "foo")
        .should("contains.text", "bar")
    })
    it("should execute application/x-www-form-urlencoded THEN execute application/json", () => {
      // final curl should have both "bar" and "foo"
      cy.get("@selectMediaType")
        .select(mediaTypeUrlencoded)
        .get("@executeBtn")
        .click()
        .get("@selectMediaType")
        .select(mediaTypeJson)
        .get("@executeBtn")
        .click()
        // cURL component
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "foo")
        .should("contains.text", "bar")
    })
  })
})
