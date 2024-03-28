/**
 * @prettier
 */

describe("OpenAPI 3.0 Allow Empty Values in Request Body", () => {
  it("should not apply or render to required fields", () => {
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
      // Request Body
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(2) > .parameters-col_description .parameter__empty_value_toggle input")
      .should("not.exist")
  })

  it("by default, should be checked for all non-required fields", () => {
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
      // Request Body
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .json-schema-form-item-remove")
      .click()
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .parameter__empty_value_toggle input")
      .should("be.checked")
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(6) > .parameters-col_description select")
      .select("--")
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(6) > .parameters-col_description .parameter__empty_value_toggle input")
      .should("be.checked")
  })

  it("checkbox should be toggle-able", () => {
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
      // Request Body
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .json-schema-form-item-remove")
      .click()
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .parameter__empty_value_toggle input")
      .should("be.checked")
      .uncheck()
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .parameter__empty_value_toggle input")
      .should("not.be.checked")
  })

  it("on execute, should allow send with all empty values", () => {
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
      // Remove example values
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .json-schema-form-item-remove")
      .click()
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(6) > .parameters-col_description select")
      .select("--")
      // Execute
      .get(".execute.opblock-control__btn")
      .click()
      // cURL component
      .get(".responses-wrapper .curl-command")
      .should("exist")
      .get(".responses-wrapper .curl-command span")
      .should("contains.text", "tags=&status=")
  })

  it("on execute, should allow send with some empty values", () => {
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
      // Request Body
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .json-schema-form-item-remove")
      .click()
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .parameter__empty_value_toggle input")
      .uncheck()
      // add item to pass required validation
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(4) input")
      .clear()
      // Execute
      .get(".execute.opblock-control__btn")
      .click()
      // cURL component
      .get(".responses-wrapper .curl-command")
      .should("exist")
      .get(".responses-wrapper .curl-command span")
      .should("contains.text", "&status=")
      .should("not.contains.text", "tags=")
  })

  it("on execute, should allow send with skip all empty values", () => {
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
      // Request Body
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .json-schema-form-item-remove")
      .click()
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(5) > .parameters-col_description .parameter__empty_value_toggle input")
      .uncheck()
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(6) > .parameters-col_description select")
      .select("--")
      .get(".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(6) > .parameters-col_description .parameter__empty_value_toggle input")
      .uncheck()
      // Execute
      .get(".execute.opblock-control__btn")
      .click()
      // cURL component
      .get(".responses-wrapper .curl-command")
      .should("exist")
      .get(".responses-wrapper .curl-command span")
      .should("not.contains.text", "tags=")
      .should("not.contains.text", "status=")
  })

})
