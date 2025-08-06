describe("Deep linking feature", () => {
  describe("in Swagger 2", () => {
    const swagger2BaseUrl = "/?deepLinking=true&url=/documents/features/deep-linking.swagger.yaml"

    describe("regular Operation", () => {
      OperationDeeplinkTestFactory({
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

      OperationDeeplinkTestFactory({
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
      OperationDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-patch",
        correctElementId: "operations-underscore_Tag-underscore_Operation",
        correctFragment: "#/underscore_Tag/underscore_Operation",
        correctHref: "#/underscore_Tag/underscore_Operation"
      })
    })

    describe("Operation with UTF-16 characters", () => {
      OperationDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-head",
        correctElementId: "operations-шеллы-пошел",
        correctFragment: "#/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B/%D0%BF%D0%BE%D1%88%D0%B5%D0%BB",
        correctHref: "#/шеллы/пошел"
      })
    })

    describe("Operation with no operationId", () => {
      OperationDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-put",
        correctElementId: "operations-tagTwo-put_noOperationId",
        correctFragment: "#/tagTwo/put_noOperationId",
        correctHref: "#/tagTwo/put_noOperationId"
      })
    })

    describe("regular Tag", () => {
      TagDeeplinkTestFactory({
        isTagCase: true,
        baseUrl: swagger2BaseUrl,
        elementToGet: `.opblock-tag[data-tag="myTag"][data-is-open="true"]`,
        correctElementId: "operations-tag-myTag",
        correctFragment: "#/myTag",
        correctHref: "#/myTag"
      })
    })

    describe("Tag with whitespace", () => {
      TagDeeplinkTestFactory({
        isTagCase: true,
        baseUrl: swagger2BaseUrl,
        elementToGet: `.opblock-tag[data-tag="my Tag"][data-is-open="true"]`,
        correctElementId: "operations-tag-my_Tag",
        correctFragment: "#/my%20Tag",
        correctHref: "#/my%20Tag"
      })
    })
  })
  describe("in OpenAPI 3", () => {
    const openAPI3BaseUrl = "/?deepLinking=true&url=/documents/features/deep-linking.openapi.yaml"

    describe("regular Operation", () => {
      OperationDeeplinkTestFactory({
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

      OperationDeeplinkTestFactory({
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
      OperationDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-patch",
        correctElementId: "operations-underscore_Tag-underscore_Operation",
        correctFragment: "#/underscore_Tag/underscore_Operation",
        correctHref: "#/underscore_Tag/underscore_Operation"
      })
    })

    describe("Operation with UTF-16 characters", () => {
      OperationDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-head",
        correctElementId: "operations-шеллы-пошел",
        correctFragment: "#/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B/%D0%BF%D0%BE%D1%88%D0%B5%D0%BB",
        correctHref: "#/шеллы/пошел"
      })
    })

    describe("Operation with no operationId", () => {
      OperationDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-put",
        correctElementId: "operations-tagTwo-put_noOperationId",
        correctFragment: "#/tagTwo/put_noOperationId",
        correctHref: "#/tagTwo/put_noOperationId"
      })
    })

    describe("regular Tag", () => {
      TagDeeplinkTestFactory({
        isTagCase: true,
        baseUrl: openAPI3BaseUrl,
        elementToGet: `.opblock-tag[data-tag="myTag"][data-is-open="true"]`,
        correctElementId: "operations-tag-myTag",
        correctFragment: "#/myTag",
        correctHref: "#/myTag"
      })
    })

    describe("Tag with whitespace", () => {
      TagDeeplinkTestFactory({
        isTagCase: true,
        baseUrl: openAPI3BaseUrl,
        elementToGet: `.opblock-tag[data-tag="my Tag"][data-is-open="true"]`,
        correctElementId: "operations-tag-my_Tag",
        correctFragment: "#/my%20Tag",
        correctHref: "#/my%20Tag"
      })
    })
  })
})

function OperationDeeplinkTestFactory({ baseUrl, elementToGet, correctElementId, correctFragment, correctHref }) {
  it("should generate a correct element ID", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .should("have.id", correctElementId)
  })

  it("should add the correct element fragment to the URL when expanded", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .click()
    cy.location().should((loc) => {
      expect(loc.hash).to.eq(correctFragment)
    })
  })

  it("should provide an anchor link that has the correct fragment as href", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .find("a")
      .should("have.attr", "href", correctHref)
      .click()
    cy.location().should((loc) => {
      expect(loc.hash).to.eq(correctFragment)
    })
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
    cy.location().should((loc) => {
      expect(loc.hash).to.eq(correctFragment)
    })
  })

  it("should expand a tag with docExpansion disabled", () => {
    cy.visit(`${baseUrl}&docExpansion=none${correctFragment}`)
      .get(`.opblock-tag-section.is-open`)
      .should("have.length", 1)
  })

  it("should expand an operation with docExpansion disabled", () => {
    cy.visit(`${baseUrl}&docExpansion=none${correctFragment}`)
      .get(`.opblock.is-open`)
      .should("have.length", 1)
  })
}

function TagDeeplinkTestFactory({ baseUrl, elementToGet, correctElementId, correctFragment, correctHref }) {
  it("should generate a correct element ID", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .should("have.id", correctElementId)
  })

  it("should add the correct element fragment to the URL when expanded", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .click()
      .click() // tags need two clicks because they're expanded by default
    cy.location().should((loc) => {
      expect(loc.hash).to.eq(correctFragment)
    })
  })

  it("should provide an anchor link that has the correct fragment as href", () => {
    cy.visit(baseUrl)
      .get(elementToGet)
      .find("a")
      .should("have.attr", "href", correctHref)
  })

  it("should expand the tag when reloaded", () => {
    cy.visit(`${baseUrl}${correctFragment}`)
      .get(`${elementToGet}[data-is-open="true"]`)
      .should("exist")
  })

  it("should retain the correct fragment when reloaded", () => {
    cy.visit(`${baseUrl}${correctFragment}`)
      .reload()
      .should("exist")
    cy.location().should((loc) => {
      expect(loc.hash).to.eq(correctFragment)
    })
  })

  it("should expand a tag with docExpansion disabled", () => {
    cy.visit(`${baseUrl}&docExpansion=none${correctFragment}`)
      .get(`.opblock-tag-section.is-open`)
      .should("have.length", 1)
  })
}
