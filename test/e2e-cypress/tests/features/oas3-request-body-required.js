/**
 * @prettier
 */

describe("OpenAPI 3.0 Validation for Required Request Body and Request Body Fields", () => {
  describe("Request Body required bug/5181", () => {
    it("on execute, if empty value, SHOULD render class 'invalid' and should NOT render cURL component", () => {
      cy.visit(
        "/?url=/documents/bugs/5181.yaml"
      )
        .get("#operations-default-post_foos")
        .click()
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // get input
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(1) > .parameters-col_description input")
        .should("not.have.class", "invalid")
        // Execute
        .get(".execute.opblock-control__btn")
        .click()
        // class "invalid" should now exist (and render red, which we won't check)
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(1) > .parameters-col_description input")
        .should("have.class", "invalid")
        // cURL component should not exist
        .get(".responses-wrapper .curl-command")
        .should("not.exist")
    })
    it("on execute, if value exists, should NOT render class 'invalid' and SHOULD render cURL component", () => {
      cy.visit(
        "/?url=/documents/bugs/5181.yaml"
      )
        .get("#operations-default-post_foos")
        .click()
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // get input
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(1) > .parameters-col_description input")
        .type("abc")
        // Execute
        .get(".execute.opblock-control__btn")
        .click()
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(1) > .parameters-col_description input")
        .should("not.have.class", "invalid")
        // cURL component should exist
        .get(".responses-wrapper .curl-command")
        .should("exist")
    })
  })

  describe("Request Body required fields - application/json", () => {
    it("on execute, if empty value, SHOULD render class 'invalid' and should NOT render cURL component", () => {
      cy.visit(
        "/?url=/documents/features/petstore-only-pet.openapi.yaml"
      )
        .get("#operations-pet-addPet")
        .click()
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // get and clear textarea
        .get(".opblock-body .opblock-section .opblock-section-request-body .body-param textarea")
        .should("not.have.class", "invalid")
        .clear()
        // Execute
        .get(".execute.opblock-control__btn")
        .click()
        // class "invalid" should now exist (and render red, which we won't check)
        .get(".opblock-body .opblock-section .opblock-section-request-body .body-param textarea")
        .should("have.class", "invalid")
        // cURL component should not exist
        .get(".responses-wrapper .curl-command")
        .should("not.exist")
    })
    it("on execute, if value exists, even if just single space, should NOT render class 'invalid' and SHOULD render cURL component that contains the single space", () => {
      cy.visit(
        "/?url=/documents/features/petstore-only-pet.openapi.yaml"
      )
        .get("#operations-pet-addPet")
        .click()
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // get, clear, then modify textarea
        .get(".opblock-body .opblock-section .opblock-section-request-body .body-param textarea")
        .clear()
        .type(" ")
        // Execute
        .get(".execute.opblock-control__btn")
        .click()
        .get(".opblock-body .opblock-section .opblock-section-request-body .body-param textarea")
        .should("not.have.class", "invalid")
        // cURL component should exist
        .get(".responses-wrapper .curl-command")
        .should("exist")
        .get(".responses-wrapper .curl-command span")
        .should("contains.text", "' '")
    })
  })

  /* 
  petstore ux notes: 
  - required field, but if example value exists, will populate the field. So this test will clear the example value.
  - "add item" will insert an empty array, and display an input text box. This establishes a value for the field.
  */
  describe("Request Body required fields - application/x-www-form-urlencoded", () => {
    it("on execute, if empty value, SHOULD render class 'invalid' and should NOT render cURL component", () => {
      cy.visit(
        "/?url=/documents/features/petstore-only-pet.openapi.yaml"
      )
        .get("#operations-pet-addPet")
        .click()
        .get(".opblock-section .opblock-section-request-body .body-param-content-type > select")
        .select("application/x-www-form-urlencoded")
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // get and clear input populated from example value
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(2) > .parameters-col_description input")
        .clear()
        // Execute
        .get(".execute.opblock-control__btn")
        .click()
        // class "invalid" should now exist (and render red, which we won't check)
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(2) > .parameters-col_description input")
        .should("have.class", "invalid")
        // cURL component should not exist
        .get(".responses-wrapper .curl-command")
        .should("not.exist")
    })
    it("on execute, if all values exist, even if array exists but is empty, should NOT render class 'invalid' and SHOULD render cURL component", () => {
      cy.visit(
        "/?url=/documents/features/petstore-only-pet.openapi.yaml"
      )
        .get("#operations-pet-addPet")
        .click()
        .get(".opblock-section .opblock-section-request-body .body-param-content-type > select")
        .select("application/x-www-form-urlencoded")
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // add item to get input
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(4) > .parameters-col_description button")
        .click()
        // Execute
        .get(".execute.opblock-control__btn")
        .click()
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(2) > .parameters-col_description input")
        .should("have.value", "doggie")
        .should("not.have.class", "invalid")
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(4) > .parameters-col_description input")
        .should("have.value", "string")
        .should("not.have.class", "invalid")
        // cURL component should exist
        .get(".responses-wrapper .curl-command")
        .should("exist")
    })
  })

  describe("Request Body: switching between Content Types", () => {
    it("after application/json 'invalid' error, on switch content type to application/x-www-form-urlencoded, SHOULD be free of errors", () => {
      cy.visit(
        "/?url=/documents/features/petstore-only-pet.openapi.yaml"
      )
        .get("#operations-pet-addPet")
        .click()
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // get and clear textarea
        .get(".opblock-body .opblock-section .opblock-section-request-body .body-param textarea")
        .should("not.have.class", "invalid")
        .clear()
        // Execute
        .get(".execute.opblock-control__btn")
        .click()
        .get(".opblock-body .opblock-section .opblock-section-request-body .body-param textarea")
        .should("have.class", "invalid")
        // switch content type
        .get(".opblock-section .opblock-section-request-body .body-param-content-type > select")
        .select("application/x-www-form-urlencoded")
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(2) > .parameters-col_description input")
        .should("not.have.class", "invalid")
        // add item to get input, just an extra confirmation of non-invalid class
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(4) > .parameters-col_description button")
        .click()
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(4) > .parameters-col_description input")
        .should("not.have.class", "invalid")
    })
    it("after application/x-www-form-urlencoded 'invalid' error, on switch content type to application/json, SHOULD be free of errors", () => {
      cy.visit(
        "/?url=/documents/features/petstore-only-pet.openapi.yaml"
      )
        .get("#operations-pet-addPet")
        .click()
        .get(".opblock-section .opblock-section-request-body .body-param-content-type > select")
        .select("application/x-www-form-urlencoded")
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // get and clear input
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(2) > .parameters-col_description input")
        .clear()
        // Execute
        .get(".execute.opblock-control__btn")
        .click()
        // class "invalid" should now exist (and render red, which we won't check)
        .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(2) > .parameters-col_description input")
        .should("have.class", "invalid")
        // switch content type
        .get(".opblock-section .opblock-section-request-body .body-param-content-type > select")
        .select("application/json")
        .get(".opblock-body .opblock-section .opblock-section-request-body .body-param textarea")
        .should("not.have.class", "invalid")
    })
  })
})
