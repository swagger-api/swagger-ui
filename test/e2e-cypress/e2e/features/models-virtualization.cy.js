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

  describe("non-virtualized path — below threshold (OpenAPI 3.1)", () => {
    it("renders all schemas without a scroll wrapper", () => {
      cy.visit("/?url=/documents/features/oas31-schema-expansion.yaml")
      cy.get(".models-scroll").should("not.exist")
      cy.get(".json-schema-2020-12:not(.json-schema-2020-12--embedded)").should(
        "have.length",
        1
      )
    })
  })

  describe("virtualized path — above threshold (OpenAPI 3.1)", () => {
    const baseUrl = "/?url=/documents/perf/many-schemas.openapi31.yaml"

    it("renders a scroll wrapper and mounts only a windowed subset", () => {
      cy.visit(baseUrl)
      cy.get(".models-scroll").should("exist")
      cy.get(".json-schema-2020-12:not(.json-schema-2020-12--embedded)").should(
        "have.length.lessThan",
        240
      )
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
      cy.contains(".json-schema-2020-12-accordion", "PerfModel001").should(
        "exist"
      )

      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = $scroll[0].scrollHeight
        cy.wait(200)
        cy.contains(".json-schema-2020-12-accordion", "PerfModel001").should(
          "not.exist"
        )
        cy.contains(".json-schema-2020-12-accordion", "PerfModel240").should(
          "exist"
        )
        cy.get(
          ".json-schema-2020-12:not(.json-schema-2020-12--embedded)"
        ).should("have.length.lessThan", 240)
      })
    })

    it("expanded schema state is preserved when scrolled out of view and back", () => {
      cy.visit(baseUrl)
      cy.get(".models-scroll").should("exist")
      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-body")
        .first()
        .should("have.class", "json-schema-2020-12-body--collapsed")
      cy.contains(".json-schema-2020-12-accordion", "PerfModel001").click()
      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-body")
        .first()
        .should("not.have.class", "json-schema-2020-12-body--collapsed")

      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = $scroll[0].scrollHeight
      })
      cy.wait(200)
      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = 0
      })
      cy.wait(200)

      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-body")
        .first()
        .should("not.have.class", "json-schema-2020-12-body--collapsed")
    })

    it("collapsed nested property state is preserved when scrolled out of view and back", () => {
      cy.visit(baseUrl)
      cy.get(".models-scroll").should("exist")

      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-expand-deep-button")
        .first()
        .click()
      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .contains("Items")
        .should("exist")
      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .contains(".json-schema-2020-12-accordion", "tags")
        .click()
      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .contains("Items")
        .should("not.exist")

      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = $scroll[0].scrollHeight
      })
      cy.wait(200)
      cy.get(".models-scroll").then(($scroll) => {
        $scroll[0].scrollTop = 0
      })
      cy.wait(200)

      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-body")
        .first()
        .should("not.have.class", "json-schema-2020-12-body--collapsed")
      cy.contains(".json-schema-2020-12-accordion", "PerfModel001")
        .closest(".json-schema-2020-12")
        .contains("Items")
        .should("not.exist")
    })
  })
})
