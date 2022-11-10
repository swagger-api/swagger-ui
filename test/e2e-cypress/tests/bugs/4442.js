/**
 * @prettier
 */

describe("UI #4442: Parameter.content display and execution", function() {
  it("should display textareas as static documentation according to the `example`", () => {
    cy.visit("/?url=/documents/bugs/4442.yaml")
      .get(`#operations-default-get_`)
      .click()
      .get(".btn.try-out__btn")
      .click()
      .get(
        `div.json-schema-array > div:nth-child(1) > div > textarea`
      )
      .should("have.value", `{\n  "userId": 1,\n  "currency": "USD"\n}`)
      .get(
        `div.json-schema-array > div:nth-child(2) > div > textarea`
      )
      .should("have.value", `{\n  "userId": 2,\n  "currency": "CAD"\n}`)
  })
  it("should serialize JSON into a query correctly", () => {
    cy.visit("/?url=/documents/bugs/4442.yaml")
      .get(`#operations-default-get_`)
      .click()
      .get(".btn.try-out__btn")
      .click()
      .get(".btn.execute")
      .click()
      .get(".request-url pre")
      .should(
        "have.text",
        `http://localhost:3230/?users=${encodeURIComponent(
          `[{"userId":1,"currency":"USD"},{"userId":2,"currency":"CAD"}]`
        )}`
      )
  })
})
