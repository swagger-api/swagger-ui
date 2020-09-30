/**
 * @prettier
 */

describe("JSON Schema Form: Enum & Boolean in a Parameter", () => {
  beforeEach(() => {
    cy.visit(
      "/?url=/documents/features/schema-form-enum-boolean.yaml"
    )
      .get("#operations-pet-findPetsByStatus")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
    // @alias Execute Button
    cy.get(".execute.opblock-control__btn").as("executeBtn")
    // @alias Parameters
    cy.get(".opblock-section tbody > tr > .parameters-col_description > select")
      .eq(0)
      .as("enumIsRequired")
    cy.get(".opblock-section tbody > tr > .parameters-col_description > select")
      .eq(1)
      .as("booleanIsOptional")
    cy.get(".opblock-section tbody > tr > .parameters-col_description > select")
      .eq(2)
      .as("booleanIsRequired")
  })

  it("should render @enumIsRequired with list of three options", () => {
    cy.get("@enumIsRequired")
      .should("contains.text", "available")
      .should("contains.text", "pending")
      .should("contains.text", "sold")
      .should("not.contains.text", "--")
      .find("option")
      .should("have.length", 3)
  })
  it("should render @booleanIsOptional with default empty string value (display '--')", () => {
    cy.get("@booleanIsOptional")
      .should("have.value", "")
      .should("contains.text", "--")
  })
  it("should render @booleanIsRequired with default empty string value (display '--')", () => {
    cy.get("@booleanIsRequired")
      .should("have.value", "")
      .should("contains.text", "--")
  })
  it("should NOT be able to execute with empty @enumIsRequired and @booleanIsRequired values", () => {
    // Execute
    cy.get("@executeBtn")
      .click()
    cy.get("@enumIsRequired")
      .should("have.class", "invalid")
    cy.get("@booleanIsRequired")
      .should("have.class", "invalid")
    // cURL component
    cy.get(".responses-wrapper .curl-command")
      .should("not.exist")
  })
  it("should NOT be able to execute with empty @booleanIsRequired value, but valid @enumIsRequired", () => {
    cy.get("@enumIsRequired")
      .select("pending")
    // Execute
    cy.get("@executeBtn")
      .click()
    cy.get("@enumIsRequired")
      .should("not.have.class", "invalid")
    cy.get("@booleanIsRequired")
      .should("have.class", "invalid")
    // cURL component
    cy.get(".responses-wrapper .curl-command")
      .should("not.exist")
  })
  it("should NOT be able to execute with empty @enumIsRequired value, but valid @booleanIsRequired", () => {
    cy.get("@booleanIsRequired")
      .select("false")
    // Execute
    cy.get("@executeBtn")
      .click()
    cy.get("@enumIsRequired")
      .should("have.class", "invalid")
    cy.get("@booleanIsRequired")
      .should("not.have.class", "invalid")
    // cURL component
    cy.get(".responses-wrapper .curl-command")
      .should("not.exist")
  })
  it("should execute, if @booleanIsOptional value is 'false'", () => {
    cy.get("@enumIsRequired")
      .select("pending")
    cy.get("@booleanIsRequired")
      .select("false")
    cy.get("@booleanIsOptional")
      .select("false")
    // Execute
    cy.get("@executeBtn")
      .click()
    cy.get("@enumIsRequired")
      .should("not.have.class", "invalid")
    cy.get("@booleanIsRequired")
      .should("not.have.class", "invalid")
      .should("not.contains.text", "expectIsOptional")
    // cURL component
    cy.get(".responses-wrapper .curl-command")
      .should("exist")
      .get(".responses-wrapper .curl-command span")
      .should("contains.text", "expectIsOptional=false")
  })
  it("should execute, but NOT send @booleanIsOptional value if not provided", () => {
    cy.get("@enumIsRequired")
      .select("pending")
    cy.get("@booleanIsRequired")
      .select("false")
    // Execute
    cy.get("@executeBtn")
      .click()
    cy.get("@enumIsRequired")
      .should("not.have.class", "invalid")
    cy.get("@booleanIsRequired")
      .should("not.have.class", "invalid")
      .should("not.contains.text", "expectIsOptional")
    // cURL component
    cy.get(".responses-wrapper .curl-command")
      .should("exist")
      .get(".responses-wrapper .curl-command span")
      .should("not.contains.text", "expectIsOptional")
  })

})
