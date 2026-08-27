/**
 * @prettier
 */

describe("Models list virtualization", () => {
  describe("non-virtualized path — below threshold (OpenAPI 2.0)", () => {
    it("renders all model-container elements without a scroll wrapper", () => {
      cy.visit("/?url=/documents/features/models.swagger.yaml")
      cy.get(".models-scroll").should("not.exist")
      cy.get(".model-container").should("have.length", 3)
    })
  })

  describe("virtualized path — above threshold (OpenAPI 2.0)", () => {
    const baseUrl = "/?url=/documents/perf/many-schemas.swagger.yaml"

    it("renders a scroll wrapper and mounts only a windowed subset", () => {
      cy.visit(baseUrl)
      cy.get(".models-scroll").should("exist")
      cy.get(".model-container").should("have.length.lessThan", 240)
    })

    it("section header collapse and expand still works", () => {
      cy.visit(baseUrl)
      cy.get(".models").should("have.class", "is-open")
      cy.get(".models h4 .models-control").click()
      cy.get(".models").should("not.have.class", "is-open")
      cy.get(".models-scroll").should("not.exist")
      cy.get(".models h4 .models-control").click()
      cy.get(".models").should("have.class", "is-open")
      cy.get(".models-scroll").should("exist")
    })

    it("scrolling renders new items and unmounts old ones", () => {
      cy.visit(baseUrl)
      cy.get(".models-scroll").should("exist")
      cy.get("#model-PerfModel001").should("exist")

      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = $scroll[0].scrollHeight
        cy.wait(200)
        cy.get("#model-PerfModel001").should("not.exist")
        cy.get("#model-PerfModel240").should("exist")
        cy.get(".model-container").should("have.length.lessThan", 240)
      })
    })

    it("expanded model state is preserved when scrolled out of view and back", () => {
      cy.visit(baseUrl)
      // expand first visible model
      cy.get(".models-scroll").should("exist")
      cy.get("#model-PerfModel001 span.inner-object").should("not.exist")
      cy.get("#model-PerfModel001 .model-box-control").click()
      cy.get("#model-PerfModel001 span.inner-object").should("exist")

      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = $scroll[0].scrollHeight
      })
      cy.wait(200)
      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = 0
      })
      cy.wait(200)

      cy.get("#model-PerfModel001 span.inner-object").should("exist")
    })

    it("expanded nested property state is preserved when scrolled out of view and back", () => {
      cy.visit(baseUrl)
      cy.get("#model-PerfModel001 .model-box-control").first().click()
      cy.get("#model-PerfModel001 span.inner-object").should("exist")
      cy.get("#model-PerfModel001 span.inner-object .prop-type").should(
        "not.exist"
      )
      cy.get("#model-PerfModel001 span.inner-object .model-box-control")
        .first()
        .click()
      cy.get("#model-PerfModel001 span.inner-object .prop-type").should("exist")

      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = $scroll[0].scrollHeight
      })
      cy.wait(200)
      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = 0
      })
      cy.wait(200)

      cy.get("#model-PerfModel001 span.inner-object .prop-type").should("exist")
    })
  })

  describe("virtualized path — above threshold (OpenAPI 3.0)", () => {
    it("renders a scroll wrapper and mounts only a windowed subset", () => {
      cy.visit("/?url=/documents/perf/many-schemas.openapi.yaml")
      cy.get(".models-scroll").should("exist")
      cy.get(".model-container").should("have.length.lessThan", 240)
    })
  })
})
