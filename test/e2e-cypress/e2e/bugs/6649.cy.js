describe("#6649: Authorize popup buttons should not overlap", () => {
  it("should render authorize and close buttons without overlapping", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize")
      .click()
      .get(".auth-btn-wrapper")
      .should("be.visible")
      .within(() => {
        cy.get(".btn.authorize").then(($authorize) => {
          cy.get(".btn-done").then(($close) => {
            const authorizeRect = $authorize[0].getBoundingClientRect()
            const closeRect = $close[0].getBoundingClientRect()

            // The authorize button should end before the close button starts
            // (no horizontal overlap)
            expect(
              authorizeRect.right,
              "authorize button right edge should be at or before close button left edge"
            ).to.be.at.most(closeRect.left)
          })
        })
      })
  })
})
