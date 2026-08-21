describe("#10047: String default '1.0' preserved for form-urlencoded", () => {
  it("should preserve string default value '1.0' exactly as specified", () => {
    cy
      .visit("?url=/documents/bugs/10047.yaml")
      .get("#operations-default-testOp")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // Check that the default value is "1.0" (not "1")
      .get(`.parameters[data-property-name="versionTag"] input`)
      .should("have.value", "1.0")
      // Execute the request and check the curl command
      .get(".btn.execute")
      .click()
      // Check that the curl command contains versionTag=1.0
      .get(".curl")
      .should("contain", "versionTag=1.0")
      .should("not.contain", "versionTag=1")
  })
  
  it("should preserve user-entered value '2.0' correctly", () => {
    cy
      .visit("?url=/documents/bugs/10047.yaml")
      .get("#operations-default-testOp")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // Change the value
      .get(`.parameters[data-property-name="versionTag"] input`)
      .clear()
      .type("2.0")
      // Execute the request
      .get(".btn.execute")
      .click()
      // Check that the curl command contains versionTag=2.0
      .get(".curl")
      .should("contain", "versionTag=2.0")
  })
  
  it("should reset to default value '1.0' correctly", () => {
    cy
      .visit("?url=/documents/bugs/10047.yaml")
      .get("#operations-default-testOp")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // Change the value
      .get(`.parameters[data-property-name="versionTag"] input`)
      .clear()
      .type("2.0")
      // Reset
      .get(".try-out__btn.reset")
      .click()
      // Check that the value is reset to "1.0" (not "1")
      .get(`.parameters[data-property-name="versionTag"] input`)
      .should("have.value", "1.0")
  })
})

