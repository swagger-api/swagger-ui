describe("External docs feature", () => {
  describe("in Swagger 2", () => {
    ExternalDocsTest("/?url=/documents/features/external-docs.swagger.yaml")
  })
  describe("in OpenAPI 3", () => {
    ExternalDocsTest("/?url=/documents/features/external-docs.openapi.yaml")
  })
})

function ExternalDocsTest(baseUrl) {
  describe("for Root", () => {
    it("should display link to external docs with description", () => {
      cy.visit(baseUrl)
      .get(".info__extdocs")
      .should("exist")
      .and("contain.text", "Read external docs")
      .and("have.attr", "href", "http://swagger.io/")
    })

    it("should display link to external docs without description", () => {
      cy
        .intercept({
          path: /^\/documents\/features\/external-docs\.(swagger|openapi)\.yaml\?intercept$/
        }, (req) => {
          delete req.headers["if-none-match"]
          delete req.headers["if-modified-since"]
          req.continue((res) => {
            res.send({body: res.body.replace("  description: Read external docs\n", "")})
          })
        })
        .visit(`${baseUrl}?intercept`)
        .get(".info__extdocs")
        .should("exist")
        .and("contain.text", "http://swagger.io")
        .and("have.attr", "href", "http://swagger.io/")
    })
  })

  describe("for Tags", () => {
    it("should display link to external docs with description", () => {
      cy.visit(baseUrl)
      .get(`.opblock-tag[data-tag="pet"] .info__externaldocs`)
      .should("exist")
      .find("a")
      .should("contain.text", "Pet Documentation")
      .and("have.attr", "href", "http://swagger.io/")
    })

    it("should display link to external docs without description", () => {
      cy.visit(baseUrl)
      .get(`.opblock-tag[data-tag="petWithoutDescription"] .info__externaldocs`)
      .should("exist")
      .find("a")
      .should("contain.text", "http://swagger.io")
      .and("have.attr", "href", "http://swagger.io/")
    })
  })

  describe("for Schemas", () => {
    function SchemaTestFactory(type) {
      return () => {
        it("should display link with description", () => {
          cy.visit(baseUrl)
          .get(`.models #model-${type} button`)
          .click()
          .get(`.models #model-${type} .external-docs a`)
          .should("contain.text", `${type} Docs`)
          .and("have.attr", "href", "http://swagger.io/")
        })

        it("should display link without description", () => {
          cy.visit(baseUrl)
          .get(`.models #model-${type}WithoutDescription button`)
          .click()
          .get(`.models #model-${type}WithoutDescription .external-docs a`)
          .should("contain.text", "http://swagger.io")
          .and("have.attr", "href", "http://swagger.io/")
        })
      }
    }

    describe("Primitive Schema", SchemaTestFactory("Primitive"))
    describe("Array Schema", SchemaTestFactory("Array"))
    describe("Object Schema", SchemaTestFactory("Object"))
  })

  describe("for Operation", () => {
    it("should display link to external docs with description", () => {
      cy.visit(baseUrl)
      .get("#operations-pet-updatePet button.opblock-summary-control")
      .click()
      .get("#operations-pet-updatePet .opblock-external-docs-wrapper .opblock-external-docs__description")
      .should("contain.text", "More details about putting a pet")
      .get("#operations-pet-updatePet .opblock-external-docs-wrapper .opblock-external-docs__link")
      .should("have.attr", "href", "http://swagger.io/")
    })

    it("should display link to external docs without description", () => {
      cy.visit(baseUrl)
      .get("#operations-pet-addPet button.opblock-summary-control")
      .click()
      .get("#operations-pet-addPet .opblock-external-docs-wrapper .opblock-external-docs__description")
      .should("not.exist")
      .get("#operations-pet-addPet .opblock-external-docs-wrapper .opblock-external-docs__link")
      .should("have.attr", "href", "http://swagger.io/")
    })
  })
}
