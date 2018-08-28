describe("Deep linking feature", () => {
  describe("in Swagger 2", () => {
    const baseUrl = "/?deepLinking=true&url=/documents/features/deep-linking.swagger.yaml"
    beforeEach(() => {
      cy.visit(baseUrl)
    })
    describe("regular Operation", () => {
      const elementToGet = ".opblock-get"
      const correctElementId = "operations-myTag-myOperation"
      const correctFragment = "#/myTag/myOperation"

      it("should generate a correct element ID", () => {
        cy.get(elementToGet)
          .should("have.id", correctElementId)
      })

      it("should add the correct element fragment to the URL when expanded", () => {
        cy.get(elementToGet)
          .click()
          .window()
          .should("have.deep.property", "location.hash", correctFragment)
      })

      it("should provide an anchor link that has the correct fragment as href", () => {
        cy.get(elementToGet)
          .find("a")
          .should("have.attr", "href", correctFragment)
          .click()
          .window()
          .should("have.deep.property", "location.hash", correctFragment)
      })

      it("should expand the operation when reloaded", () => {
        cy.visit(`${baseUrl}${correctFragment}`)
          .reload()
          .get(`${elementToGet}.is-open`)
          .should("exist")
      })
    })

    describe("Operation with whitespace in tag+id", () => {
      const elementToGet = ".opblock-post"
      const correctElementId = "operations-my_Tag-my_Operation"
      const correctFragment = "#/my_Tag/my_Operation"

      it("should generate a correct element ID", () => {
        cy.get(elementToGet)
          .should("have.id", correctElementId)
      })

      it("should add the correct element fragment to the URL when expanded", () => {
        cy.get(elementToGet)
          .click()
          .window()
          .should("have.deep.property", "location.hash", correctFragment)
      })

      it("should provide an anchor link that has the correct fragment as href", () => {
        cy.get(elementToGet)
          .find("a")
          .should("have.attr", "href", correctFragment)
          .click()
          .should("have.attr", "href", correctFragment) // should be valid after expanding

      })

      it("should expand the operation when reloaded", () => {
        cy.visit(`${baseUrl}${correctFragment}`)
          .reload()
          .get(`${elementToGet}.is-open`)
          .should("exist")
      })
    })

    describe("regular Operation with `docExpansion: none` enabled", function() {
      it("should expand a tag", () => {
        cy.visit(`${baseUrl}&docExpansion=none#/myTag`)
          .get(`.opblock-tag-section.is-open`)
          .should("have.length", 1)
      })
      it("should expand an operation", () => {
        cy.visit(`${baseUrl}&docExpansion=none#/myTag/myOperation`)
          .get(`.opblock.is-open`)
          .should("have.length", 1)
      })
    })
  })
  describe("in OpenAPI 3", () => {
    const baseUrl = "/?deepLinking=true&url=/documents/features/deep-linking.swagger.yaml"
    beforeEach(() => {
      cy.visit(baseUrl)
    })
    describe("regular Operation", () => {
      const elementToGet = ".opblock-get"
      const correctElementId = "operations-myTag-myOperation"
      const correctFragment = "#/myTag/myOperation"

      it("should generate a correct element ID", () => {
        cy.get(elementToGet)
          .should("have.id", correctElementId)
      })

      it("should add the correct element fragment to the URL when expanded", () => {
        cy.get(elementToGet)
          .click()
          .window()
          .should("have.deep.property", "location.hash", correctFragment)
      })

      it("should provide an anchor link that has the correct fragment as href", () => {
        cy.get(elementToGet)
          .find("a")
          .should("have.attr", "href", correctFragment)
          .click()
          .window()
          .should("have.deep.property", "location.hash", correctFragment)
      })

      it("should expand the operation when reloaded", () => {
        cy.visit(`${baseUrl}${correctFragment}`)
          .reload()
          .get(`${elementToGet}.is-open`)
          .should("exist")
      })
    })

    describe("Operation with whitespace in tag+id", () => {
      const elementToGet = ".opblock-post"
      const correctElementId = "operations-my_Tag-my_Operation"
      const correctFragment = "#/my_Tag/my_Operation"

      it("should generate a correct element ID", () => {
        cy.get(elementToGet)
          .should("have.id", correctElementId)
      })

      it("should add the correct element fragment to the URL when expanded", () => {
        cy.get(elementToGet)
          .click()
          .window()
          .should("have.deep.property", "location.hash", correctFragment)
      })

      it("should provide an anchor link that has the correct fragment as href", () => {
        cy.get(elementToGet)
          .find("a")
          .should("have.attr", "href", correctFragment)
          .click()
          .should("have.attr", "href", correctFragment) // should be valid after expanding

      })

      it("should expand the operation when reloaded", () => {
        cy.visit(`${baseUrl}${correctFragment}`)
          .reload()
          .get(`${elementToGet}.is-open`)
          .should("exist")
      })
    })

    describe("regular Operation with `docExpansion: none` enabled", function () {
      it("should expand a tag", () => {
        cy.visit(`${baseUrl}&docExpansion=none#/myTag`)
          .get(`.opblock-tag-section.is-open`)
          .should("have.length", 1)
      })
      it("should expand an operation", () => {
        cy.visit(`${baseUrl}&docExpansion=none#/myTag/myOperation`)
          .get(`.opblock.is-open`)
          .should("have.length", 1)
      })
    })
  })
})