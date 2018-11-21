describe("Deep linking feature", () => {
  describe("in Swagger 2", () => {
    const swagger2BaseUrl = "/?deepLinking=true&url=/documents/features/deep-linking.swagger.yaml"

    describe("regular Operation", () => {
      BaseDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-get",
        correctElementId: "operations-myTag-myOperation",
        correctFragment: "#/myTag/myOperation",
        correctHref: "#/myTag/myOperation"
      })
    })

    describe("Operation with whitespace in tag+id", () => {
      const elementToGet = ".opblock-post"
      const correctFragment = "#/my%20Tag/my%20Operation"
      
      BaseDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet,
        correctElementId: "operations-my_Tag-my_Operation",
        correctFragment,
        correctHref: "#/my%20Tag/my%20Operation"
      })

      const legacyFragment = "#/my_Tag/my_Operation"

      it("should expand the operation when reloaded and provided the legacy fragment", () => {
        cy.visit(`${swagger2BaseUrl}${legacyFragment}`)
          .reload()
          .get(`${elementToGet}.is-open`)
          .should("exist")
      })

      it.skip("should rewrite to the correct fragment when provided the legacy fragment", () => {
        cy.visit(`${swagger2BaseUrl}${legacyFragment}`)
          .reload()
          .window()
          .should("have.deep.property", "location.hash", correctFragment)
      })
    })

    describe("Operation with underscores in tag+id", () => {
      BaseDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-patch",
        correctElementId: "operations-underscore_Tag-underscore_Operation",
        correctFragment: "#/underscore_Tag/underscore_Operation",
        correctHref: "#/underscore_Tag/underscore_Operation"
      })
    })

    describe("Operation with UTF-16 characters", () => {
      BaseDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-head",
        correctElementId: "operations-шеллы-пошел",
        correctFragment: "#/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B/%D0%BF%D0%BE%D1%88%D0%B5%D0%BB",
        correctHref: "#/шеллы/пошел"
      })
    })

    describe("Operation with no operationId", () => {
      BaseDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-put",
        correctElementId: "operations-tagTwo-put_noOperationId",
        correctFragment: "#/tagTwo/put_noOperationId",
        correctHref: "#/tagTwo/put_noOperationId"
      })
    })

    describe("regular Operation with `docExpansion: none` enabled", function() {
      it("should expand a tag", () => {
        cy.visit(`${swagger2BaseUrl}&docExpansion=none#/myTag`)
          .get(`.opblock-tag-section.is-open`)
          .should("have.length", 1)
      })
      it("should expand an operation", () => {
        cy.visit(`${swagger2BaseUrl}&docExpansion=none#/myTag/myOperation`)
          .get(`.opblock.is-open`)
          .should("have.length", 1)
      })
    })
  })
  describe("in OpenAPI 3", () => {
    const openAPI3BaseUrl = "/?deepLinking=true&url=/documents/features/deep-linking.openapi.yaml"

    describe("regular Operation", () => {
      BaseDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-get",
        correctElementId: "operations-myTag-myOperation",
        correctFragment: "#/myTag/myOperation",
        correctHref: "#/myTag/myOperation"
      })
    })

    describe("Operation with whitespace in tag+id", () => {
      const elementToGet = ".opblock-post"
      const correctFragment = "#/my%20Tag/my%20Operation"
      
      BaseDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-post",
        correctElementId: "operations-my_Tag-my_Operation",
        correctFragment,
        correctHref: "#/my%20Tag/my%20Operation"
      })
      
      const legacyFragment = "#/my_Tag/my_Operation"

      it("should expand the operation when reloaded and provided the legacy fragment", () => {
        cy.visit(`${openAPI3BaseUrl}${legacyFragment}`)
          .reload()
          .get(`${elementToGet}.is-open`)
          .should("exist")
      })


      it.skip("should rewrite to the correct fragment when provided the legacy fragment", () => {
        cy.visit(`${openAPI3BaseUrl}${legacyFragment}`)
          .reload()
          .window()
          .should("have.deep.property", "location.hash", correctFragment)
      })
    })

    describe("Operation with underscores in tag+id", () => {
      BaseDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-patch",
        correctElementId: "operations-underscore_Tag-underscore_Operation",
        correctFragment: "#/underscore_Tag/underscore_Operation",
        correctHref: "#/underscore_Tag/underscore_Operation"
      })
    })

    describe("Operation with UTF-16 characters", () => {
      BaseDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-head",
        correctElementId: "operations-шеллы-пошел",
        correctFragment: "#/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B/%D0%BF%D0%BE%D1%88%D0%B5%D0%BB",
        correctHref: "#/шеллы/пошел"
      })
    })

    describe("Operation with no operationId", () => {
      BaseDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-put",
        correctElementId: "operations-tagTwo-put_noOperationId",
        correctFragment: "#/tagTwo/put_noOperationId",
        correctHref: "#/tagTwo/put_noOperationId"
      })
    })

    describe("regular Operation with `docExpansion: none` enabled", function () {
      it("should expand a tag", () => {
        cy.visit(`${openAPI3BaseUrl}&docExpansion=none#/myTag`)
          .get(`.opblock-tag-section.is-open`)
          .should("have.length", 1)
      })
      it("should expand an operation", () => {
        cy.visit(`${openAPI3BaseUrl}&docExpansion=none#/myTag/myOperation`)
          .get(`.opblock.is-open`)
          .should("have.length", 1)
      })
    })
  })
})

function BaseDeeplinkTestFactory({ baseUrl, elementToGet, correctElementId, correctFragment, correctHref }) {
  it("should generate a correct element ID", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .should("have.id", correctElementId)
  })

  it("should add the correct element fragment to the URL when expanded", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .click()
      .window()
      .should("have.deep.property", "location.hash", correctFragment)
  })

  it("should provide an anchor link that has the correct fragment as href", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .find("a")
      .should("have.attr", "href", correctHref)
      .click()
      .window()
      .should("have.deep.property", "location.hash", correctFragment)
  })

  it("should expand the operation when reloaded", () => {
    cy.visit(`${baseUrl}${correctFragment}`)
      .get(`${elementToGet}.is-open`)
      .should("exist")
  })

  it("should retain the correct fragment when reloaded", () => {
    cy.visit(`${baseUrl}${correctFragment}`)
      .reload()
      .should("exist")
      .window()
      .should("have.deep.property", "location.hash", correctFragment)
  })
}