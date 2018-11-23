import repeat from "lodash/repeat"

describe("#5043: path-level $ref path items should inherit global consumes/produces", () => {
  it("should render consumes options correctly", () => {
    cy
      .visit("/?url=/documents/bugs/5043/swagger.yaml")
      .get("#operations-pet-findPetsByStatus")
      .click()
      .get(".try-out__btn")
      .click()
      .get(".content-type")
      .contains("application/json")
      .get(".content-type")
      .contains("application/xml")
      .get(".content-type")
      .contains("text/csv")
  })
  it("should render produces options correctly", () => {
    cy
      .visit("/?url=/documents/bugs/5043/swagger.yaml")
      .get("#operations-pet-findPetsByStatus")
      .click()
      .get(".try-out__btn")
      .click()
      .get(".body-param-content-type select")
      .contains("application/json")
      .get(".body-param-content-type select")
      .contains("application/xml")
      .get(".body-param-content-type select")
      .contains("text/csv")
  })
})