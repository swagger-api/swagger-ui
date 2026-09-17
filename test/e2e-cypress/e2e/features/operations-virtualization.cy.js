/**
 * @prettier
 */
import {
  VIRTUALIZE_OPERATIONS_TAG_ESTIMATE_SIZE,
  VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE,
} from "core/utils/virtualization"

describe("Operations list virtualization", () => {
  describe("non-virtualized path", () => {
    it("renders .opblock-tag-section wrappers and all operations", () => {
      cy.visit("/?url=/documents/features/deep-linking.swagger.yaml")
      cy.get(".opblock-tag-section").should("exist")
      cy.get(".opblock").should("have.length", 5)
    })
  })

  describe("virtualized path", () => {
    const baseUrl = "/?url=/documents/perf/many-operations.yaml"

    it("does not render .opblock-tag-section wrappers", () => {
      cy.visit(baseUrl)
      cy.get("#operations-tag-perfTag01").should("exist")
      cy.get(".opblock-tag-section").should("not.exist")
    })

    it("mounts only a windowed subset of operations", () => {
      cy.visit(baseUrl)
      cy.get("#operations-tag-perfTag01").should("exist")
      cy.get(".opblock").should("have.length.lessThan", 529)
    })

    it("scrolling renders new items and unmounts old ones", () => {
      cy.visit(baseUrl)
      cy.get("#operations-perfTag01-perfOp01_01").should("exist")
      cy.scrollTo("bottom")
      cy.wait(200)
      cy.get("#operations-perfTag24-perfOp24_22").should("exist")
      cy.get("#operations-perfTag01-perfOp01_01").should("not.exist")
    })

    it("collapsing a tag removes its operations, expanding restores them", () => {
      cy.visit(baseUrl)
      cy.get("#operations-tag-perfTag01[data-is-open='true']").should("exist")
      cy.get("#operations-perfTag01-perfOp01_01").should("exist")

      cy.get("#operations-tag-perfTag01").click()
      cy.get("#operations-tag-perfTag01[data-is-open='false']").should("exist")
      cy.get("#operations-perfTag01-perfOp01_01").should("not.exist")

      cy.get("#operations-tag-perfTag01").click()
      cy.get("#operations-tag-perfTag01[data-is-open='true']").should("exist")
      cy.get("#operations-perfTag01-perfOp01_01").should("exist")
    })

    it("expanding an operation does not reset on scroll", () => {
      cy.visit(baseUrl)
      cy.get("#operations-tag-perfTag01[data-is-open='true']").should("exist")

      cy.get(".opblock").first().as("firstOp")
      cy.get("@firstOp").find(".opblock-summary").click()
      cy.get("@firstOp").find(".opblock-body").should("be.visible")

      cy.scrollTo("bottom")
      cy.wait(300)
      cy.scrollTo("top")
      cy.wait(300)

      cy.get(".opblock").first().find(".opblock-body").should("be.visible")
    })

    it("multi-tag operation is rendered under both of its tags", () => {
      cy.visit(baseUrl)
      cy.get("#operations-tag-perfTag01").should("exist")

      // perfTag01 header + 22 regular ops before multiTagged
      const multiTaggedUnderTag01 =
        VIRTUALIZE_OPERATIONS_TAG_ESTIMATE_SIZE +
        22 * VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE
      cy.window().then((win) => win.scrollTo(0, multiTaggedUnderTag01))
      cy.wait(200)
      cy.get("#operations-perfTag01-multiTagged").should("exist")
      cy.get("#operations-perfTag01-multiTagged")
        .find(".opblock-summary")
        .click()
      cy.get("#operations-perfTag01-multiTagged")
        .find(".opblock-body")
        .should("be.visible")

      // scroll past first multiTagged and through perfTag02 to its multiTagged
      cy.window().then((win) =>
        win.scrollTo(
          0,
          2 * multiTaggedUnderTag01 + VIRTUALIZE_OPERATIONS_ESTIMATE_SIZE
        )
      )
      cy.wait(200)
      cy.get("#operations-perfTag02-multiTagged").should("exist")
      cy.get("#operations-perfTag02-multiTagged")
        .find(".opblock-body")
        .should("not.exist")
    })
  })

  describe("deep linking", () => {
    it("deep link to an operation scrolls to it", () => {
      cy.visit(
        "/?deepLinking=true&url=/documents/perf/many-operations.yaml#/perfTag15/perfOp15_01"
      )
      cy.get("#operations-tag-perfTag15[data-is-open='true']", {
        timeout: 8000,
      }).should("exist")
    })

    it("deep link to a tag header scrolls to it", () => {
      cy.visit(
        "/?deepLinking=true&url=/documents/perf/many-operations.yaml#/perfTag15"
      )
      cy.get("#operations-tag-perfTag15", { timeout: 8000 }).should("exist")
    })
  })
})
