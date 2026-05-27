/**
 * @prettier
 */
const buttonNameRule = {
  runOnly: {
    type: "rule",
    values: ["button-name"],
  },
}

describe("Button accessible names", () => {
  const checkAllButtonsHaveNames = () => {
    cy.checkA11y("#swagger-ui", buttonNameRule)
  }

  const visitTestOperation = (query = "") => {
    cy.visit(
      `/?tryItOutEnabled=true${query}&url=/documents/features/try-it-out-enabled.yaml`
    )
      .injectAxe()
      .get("#operations-default-get_")
      .click()
  }

  it("gives the operation path copy button a programmatic name", () => {
    visitTestOperation()

    cy.get(".opblock-summary .copy-to-clipboard button")
      .should("have.attr", "aria-label", "Copy path to clipboard")
      .and("have.attr", "title", "Copy path to clipboard")

    checkAllButtonsHaveNames()
  })

  it("gives the cURL command copy button a programmatic name", () => {
    visitTestOperation()

    cy.get(".btn.execute")
      .click()
      .get(".responses-wrapper .curl-command")
      .should("be.visible")

    cy.get(
      '.responses-wrapper .copy-to-clipboard button[aria-label="Copy cURL command to clipboard"]'
    )
      .should("have.attr", "aria-label", "Copy cURL command to clipboard")
      .and("have.attr", "title", "Copy cURL command to clipboard")

    checkAllButtonsHaveNames()
  })

  it("gives the request snippet copy button a programmatic name", () => {
    visitTestOperation("&requestSnippetsEnabled=true")

    cy.get(".btn.execute").click().get(".request-snippets").should("be.visible")

    cy.get(
      '.request-snippets .copy-to-clipboard button[aria-label="Copy request snippet to clipboard"]'
    )
      .should("have.attr", "aria-label", "Copy request snippet to clipboard")
      .and("have.attr", "title", "Copy request snippet to clipboard")

    checkAllButtonsHaveNames()
  })
})
