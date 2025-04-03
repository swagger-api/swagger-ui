/**
 * @prettier
 */

describe("OpenAPI 3.0 Multiple Servers", () => {
  it("should render and execute for server '/test-url-1'", () => {
    cy.visit("/?url=/documents/features/oas3-multiple-servers.yaml")
      .get(".scheme-container .schemes .servers label > select")
      .select("/test-url-1")
      .get("#operations-default-get_")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // Execute
      .get(".execute.opblock-control__btn")
      .click()
      .get(".responses-wrapper .request-url")
      .should("contains.text", "/test-url-1")
  })
  it("should render and execute for server '/test-url-2'", () => {
    cy.visit("/?url=/documents/features/oas3-multiple-servers.yaml")
      .get(".scheme-container .schemes .servers label > select")
      .select("/test-url-2")
      .get("#operations-default-get_")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // Execute
      .get(".execute.opblock-control__btn")
      .click()
      .get(".responses-wrapper .request-url")
      .should("contains.text", "/test-url-2")
  })
  it("should render and execute for server '/test-url-1' after sequence: select '/test-url-2' -> Try-It-Out -> select '/test-url-1'", () => {
    cy.visit("/?url=/documents/features/oas3-multiple-servers.yaml")
      .get(".scheme-container .schemes .servers label > select")
      .select("/test-url-2")
      .get("#operations-default-get_")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // Select a different server
      .get(".scheme-container .schemes .servers label > select")
      .select("/test-url-1")
      // Execute
      .get(".execute.opblock-control__btn")
      .click()
      .get(".responses-wrapper .request-url")
      .should("contains.text", "/test-url-1")
  })
  it("should render and execute for server '/test-url-switch-1' after changing api definition", () => {
    cy.visit("/?url=/documents/features/oas3-multiple-servers.yaml")
      .get(".scheme-container .schemes .servers label > select")
      .select("/test-url-2")
    cy.visit("/?url=/documents/features/oas3-multiple-servers-switch.yaml")
      .get(".scheme-container .schemes .servers label > select")
      .select("/test-url-switch-2")
      .get("#operations-default-get_")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // Execute
      .get(".execute.opblock-control__btn")
      .click()
      .get(".responses-wrapper .request-url")
      .should("contains.text", "/test-url-switch-2")
  })
})
