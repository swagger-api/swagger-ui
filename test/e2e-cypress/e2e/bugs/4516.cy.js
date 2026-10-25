/**
 * @prettier
 */

describe("UI #4516: array parameter items.format is rendered", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/bugs/4516.yaml")
      .get("#operations-default-searchUsers")
      .click()
  })

  it("renders items format for an array of strings with format uuid", () => {
    cy.get('tr[data-param-name="targetUserIds"]')
      .find(".parameter__type")
      .invoke("text")
      .should("match", /^array<string\(\$uuid\)>/)
  })

  it("renders items format for an array of integers with format int64", () => {
    cy.get('tr[data-param-name="limits"]')
      .find(".parameter__type")
      .invoke("text")
      .should("match", /^array<integer\(\$int64\)>/)
  })

  it("does not alter non-array parameter type rendering", () => {
    cy.get('tr[data-param-name="tag"]')
      .find(".parameter__type")
      .invoke("text")
      .should("match", /^string(\s|$)/)
  })
})
