describe("Parameter order", () => {

  it("should be well ordered", () => {
    cy.visit("/?url=/documents/features/parameter-order.yaml")
      .get("#operations-default-post_test__id__related__relatedId_")
      .click()
      .get(".parameters > tbody")
      .children()
      .each((tr, i, arr) => {
        const parameterTableRows = Array.from(arr)
        expect(tr).to.have.attr("data-param-in")
        if (i === 0) {
          return
        }
        const inValue = tr[0].getAttribute("data-param-in")
        if (!inValue) {
          return
        }
        const beforeInValue = parameterTableRows[i - 1].getAttribute("data-param-in")
        const sameAsBefore = beforeInValue === inValue
        if (sameAsBefore) {
          expect(parameterTableRows[i - 1]).to.have.attr("data-param-in", inValue)
          return
        }
        for (let x = i + 1; x < parameterTableRows.length; x++) {
          expect(parameterTableRows[x]).to.not.have.attr("data-param-in", beforeInValue)
        }
      })
  })
})
