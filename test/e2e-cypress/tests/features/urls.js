describe("configuration options: `urls` and `urls.primaryName`", () => {
  describe("`urls` only", () => {
    it("should render a list of URLs correctly", () => {
      cy.visit("/?configUrl=/configs/urls.yaml")
        .get("select")
        .children()
        .should("have.length", 2)
        .get("select > option")
        .eq(0)
        .should("have.text", "One")
        .should("have.attr", "value", "/documents/features/urls/1.yaml")
        .get("select > option")
        .eq(1)
        .should("have.text", "Two")
        .should("have.attr", "value", "/documents/features/urls/2.yaml")
    })

    it("should render the first URL in the list", () => {
      cy.visit("/?configUrl=/configs/urls.yaml")
        .get("h2.title")
        .should("have.text", "One")
        .window()
        .then(win => win.ui.specSelectors.url())
        .should("equal", "/documents/features/urls/1.yaml")
    })
  })

  it("should respect a `urls.primaryName`", () => {
    cy.visit("/?configUrl=/configs/urls-primary-name.yaml")
      .get("select")
      .should("have.value", "/documents/features/urls/2.yaml")
      .get("h2.title")
      .should("have.text", "Two")
      .window()
      .then(win => win.ui.specSelectors.url())
      .should("equal", "/documents/features/urls/2.yaml")
  })
})
