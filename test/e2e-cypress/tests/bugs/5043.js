import repeat from "lodash/repeat"

describe("#5043: path-level $ref path items should inherit global consumes", () => {
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
})