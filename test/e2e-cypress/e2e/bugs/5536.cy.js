// https://github.com/swagger-api/swagger-ui/issues/5536

describe("#5536: multiple callbacks defined on the same URL", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/bugs/5536.yaml")
      .get("#operations-default-subscribe")
      .click()
      .get("#operations-default-subscribe .tab-item")
      .contains("Callbacks")
      .click()
  })

  it("should render a separate operation block per callback name", () => {
    cy.get("#operations-callbacks-myEvent-post__request_body__callbackUrl_")
      .should("exist")
    cy.get("#operations-callbacks-otherEvent-post__request_body__callbackUrl_")
      .should("exist")
  })

  it("should expand only the clicked callback's operation block", () => {
    cy.get("#operations-callbacks-myEvent-post__request_body__callbackUrl_")
      .as("myEventOp")
      .should("not.have.class", "is-open")
    cy.get("#operations-callbacks-otherEvent-post__request_body__callbackUrl_")
      .as("otherEventOp")
      .should("not.have.class", "is-open")

    cy.get("@myEventOp")
      .find(".opblock-summary-control")
      .click()

    cy.get("@myEventOp").should("have.class", "is-open")
    cy.get("@otherEventOp").should("not.have.class", "is-open")
  })
})
