/**
 * @prettier
 */
const {
  ParameterPrimitiveTestCases,
  RequestBodyPrimitiveTestCases,
  ResponsePrimitiveTestCases,
} = require("../../support/helpers/multiple-examples")
describe("OpenAPI 3.0 Multiple Examples - core features", () => {
  describe("/String", () => {
    describe("in a parameter", () => {
      ParameterPrimitiveTestCases({
        operationDomId: "#operations-default-post_String",
        parameterName: "message",
        exampleA: {
          key: "StringExampleA",
          value: "hello world",
        },
        exampleB: {
          key: "StringExampleB",
          value: "The quick brown fox jumps over the lazy dog",
        },
        customUserInput: "OpenAPIs.org <3",
      })
    })
    describe("in a Request Body", () => {
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_String",
        exampleA: {
          key: "StringExampleA",
          value: "hello world",
          serializedValue: "hello world",
          summary: "Don't just string me along...",
        },
        exampleB: {
          key: "StringExampleB",
          value: "The quick brown fox jumps over the lazy dog",
          serializedValue: "The quick brown fox jumps over the lazy dog",
          summary: "I'm a pangram!",
        },
        customUserInput: "OpenAPIs.org <3",
      })
    })
    describe("in a Response", () => {
      ResponsePrimitiveTestCases({
        operationDomId: "#operations-default-post_String",
        exampleA: {
          key: "StringExampleA",
          value: "hello world",
          summary: "Don't just string me along...",
        },
        exampleB: {
          key: "StringExampleB",
          value: "The quick brown fox jumps over the lazy dog",
          summary: "I'm a pangram!",
        },
        exampleC: {
          key: "StringExampleC",
          value: "JavaScript rules",
          summary: "A third example, for use in special places...",
        },
      })
    })
  })
  describe("/Number", () => {
    describe("in a parameter", () => {
      ParameterPrimitiveTestCases({
        operationDomId: "#operations-default-post_Number",
        parameterName: "message",
        exampleA: {
          key: "NumberExampleA",
          value: "7710263025",
        },
        exampleB: {
          key: "NumberExampleB",
          value: "9007199254740991",
        },
        exampleC: {
          key: "NumberExampleC",
          value: "0",
        },
        customUserInput: "9001",
      })
    })
    describe("in a Request Body", () => {
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_Number",
        exampleA: {
          key: "NumberExampleA",
          value: "7710263025",
          summary: "World population",
        },
        exampleB: {
          key: "NumberExampleB",
          value: "9007199254740991",
          summary: "Number.MAX_SAFE_INTEGER",
        },
        exampleC: {
          key: "NumberExampleC",
          value: "0",
        },
        customUserInput: "1337",
      })
    })
    describe("in a Response", () => {
      ResponsePrimitiveTestCases({
        operationDomId: "#operations-default-post_Number",
        exampleA: {
          key: "NumberExampleA",
          value: "7710263025",
          summary: "World population",
        },
        exampleB: {
          key: "NumberExampleB",
          value: "9007199254740991",
          summary: "Number.MAX_SAFE_INTEGER",
        },
        exampleC: {
          key: "NumberExampleC",
          value: "0",
        },
      })
    })
  })
  describe("/Boolean", () => {
    describe("in a parameter", () => {
      it("should render and apply the first example and value by default", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Boolean")
          .click()
          // Assert on the initial dropdown value
          .get("table.parameters .examples-select > select")
          .find(":selected")
          .should("have.text", "The truth will set you free")
          // Assert on the initial JsonSchemaForm value
          .get(".parameters-col_description > select")
          .should("have.attr", "disabled")
          .get(".parameters-col_description > select")
          .find(":selected")
          .should("have.text", "true")
          // Execute
          .get(".try-out__btn")
          .click()
          .get(".execute")
          .click()
          // Assert on the request URL
          .get(".request-url")
          .contains(`?message=true`)
      })
      it("should render and apply the second value when chosen", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Boolean")
          .click()
          // Set the dropdown value, then assert on it
          .get("table.parameters .examples-select > select")
          .select("BooleanExampleB")
          .find(":selected")
          .should("have.text", "Friends don't lie to friends")
          // Set the JsonSchemaForm value, then assert on it
          .get(".parameters-col_description > select")
          .find(":selected")
          .should("have.text", "false")
          // Execute
          .get(".try-out__btn")
          .click()
          .get(".execute")
          .click()
          // Assert on the request URL
          .get(".request-url")
          .contains(`?message=false`)
      })
      it("should track value changes against valid examples", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Boolean")
          .click()
          .get(".try-out__btn")
          .click()
          // Set the JsonSchemaForm value, then assert on it
          .get(".parameters-col_description > select")
          .select("false")
          .find(":selected")
          .should("have.text", "false")
          // Assert on the dropdown value
          .get("table.parameters .examples-select > select")
          .find(":selected")
          .should("have.text", "Friends don't lie to friends")
          // Execute
          .get(".execute")
          .click()
          // Assert on the request URL
          .get(".request-url")
          .contains(`?message=false`)
      })
    })
    describe("in a Request Body", () => {
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_Boolean",
        exampleA: {
          key: "BooleanExampleA",
          value: "true",
          summary: "The truth will set you free",
        },
        exampleB: {
          key: "BooleanExampleB",
          value: "false",
          summary: "Friends don't lie to friends",
        },
        customUserInput: "tralse",
      })
    })
    describe("in a Response", () => {
      it("should render and apply the first example and value by default", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Boolean")
          .click()
          // Assert on the initial dropdown value
          .get(".responses-wrapper .examples-select > select")
          .find(":selected")
          .should("have.text", "The truth will set you free")
          // Assert on the example value
          .get(".example.microlight")
          .should("have.text", "true")
      })
      it("should render and apply the second value when chosen", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Boolean")
          .click()
          // Set the dropdown value, then assert on it
          .get(".responses-wrapper .examples-select > select")
          .select("BooleanExampleB")
          .find(":selected")
          .should("have.text", "Friends don't lie to friends")
          // Assert on the example value
          .get(".example.microlight")
          .should("have.text", "false")
      })
    })
  })
  describe("/Array", () => {
    describe("in a Parameter", () => {
      it("should have the first example's array entries by default", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "a",
              "b",
              "c",
            ])
          })
          .get(".parameters-col_description .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of strings")
      })
      it("should switch to the second array's entries via dropdown", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          .get(".parameters-col_description .examples-select > select")
          .select("ArrayExampleB")
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
            ])
          })
          .get(".parameters-col_description .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
      })
      it("should not allow modification of values in static mode", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          .get(".parameters-col_description .examples-select > select")
          .select("ArrayExampleB")
          // Add a new item
          .get(".json-schema-form-item > input")
          .should("have.attr", "disabled")
      })
      it("should allow modification of values in Try-It-Out", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          .get(".try-out__btn")
          .click()
          .get(".parameters-col_description .examples-select > select")
          .select("ArrayExampleB")
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}5")
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
              "5",
            ])
          })
          .get(".parameters-col_description .examples-select > select")
          .find(":selected")
          .should("have.text", "[Modified value]")
      })

      it("should retain a modified value, and support returning to it", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          .get(".try-out__btn")
          .click()
          .get(".parameters-col_description .examples-select > select")
          .select("ArrayExampleB")
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}5")
          // Reset to an example
          .get(".parameters-col_description .examples-select > select")
          .select("ArrayExampleB")
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
            ])
          })
          .get(".parameters-col_description .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
          // Return to the modified value
          .get(".parameters-col_description .examples-select > select")
          .select("__MODIFIED__VALUE__")
          // Assert that our modified value is back
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
              "5",
            ])
          })
          .get(".parameters-col_description .examples-select > select")
          .find(":selected")
          .should("have.text", "[Modified value]")
      })
    })
    describe("in a Request Body", () => {
      it("should have the first example's array entries by default", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Check HighlightCode value
          .get(".opblock-section-request-body .highlight-code")
          .should("include.text", JSON.stringify(["a", "b", "c"], null, 2))
          // Check dropdown value
          .get(".opblock-section-request-body .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of strings")
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("have.value", JSON.stringify(["a", "b", "c"], null, 2))
          // Check dropdown value
          .get(".opblock-section-request-body .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of strings")
      })
      it("should switch to the second array's entries via dropdown", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          .get(".opblock-section-request-body .examples-select > select")
          .select("ArrayExampleB")
          .get(".opblock-section-request-body .highlight-code")
          .should("include.text", JSON.stringify([1, 2, 3, 4], null, 2))
          .get(".opblock-section-request-body .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("include.text", JSON.stringify([1, 2, 3, 4], null, 2))
          // Check dropdown value
          .get(".opblock-section-request-body .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
      })
      it("should allow modification of values", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Choose the second example
          .get(".opblock-section-request-body .examples-select > select")
          .select("ArrayExampleB")
          // Change the value
          .get(".opblock-section-request-body textarea")
          .type(`{leftarrow}{leftarrow},{enter}  5`)
          // Check that [Modified value] is displayed in dropdown
          .get(".opblock-section-request-body .examples-select > select")
          .find(":selected")
          .should("have.text", "[Modified value]")
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("include.text", JSON.stringify([1, 2, 3, 4, 5], null, 2))
      })

      it("should retain a modified value, and support returning to it", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Choose the second example as the example to start with
          .get(".opblock-section-request-body .examples-select > select")
          .select("ArrayExampleB")
          // Change the value
          .get(".opblock-section-request-body textarea")
          .type(`{leftarrow}{leftarrow},{enter}  5`)
          // Check that [Modified value] is displayed in dropdown
          .get(".opblock-section-request-body .examples-select > select")
          .find(":selected")
          .should("have.text", "[Modified value]")
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("include.text", JSON.stringify([1, 2, 3, 4, 5], null, 2))
          // Choose the second example
          .get(".opblock-section-request-body .examples-select > select")
          .select("ArrayExampleB")
          // Check that the example is displayed in dropdown
          .get(".opblock-section-request-body .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("include.text", JSON.stringify([1, 2, 3, 4], null, 2))
          // Switch back to the modified value
          .get(".opblock-section-request-body .examples-select > select")
          .select("__MODIFIED__VALUE__")
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("include.text", JSON.stringify([1, 2, 3, 4, 5], null, 2))
      })
    })
    describe("in a Response", () => {
      it("should render and apply the first example and value by default", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Assert on the initial dropdown value
          .get(".responses-wrapper .examples-select > select")
          .find(":selected")
          .should("have.text", "A lowly array of strings")
          // Assert on the example value
          .get(".example.microlight")
          .should("include.text", JSON.stringify(["a", "b", "c"], null, 2))
      })
      it("should render and apply the second value when chosen", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Set the dropdown value, then assert on it
          .get(".responses-wrapper .examples-select > select")
          .select("ArrayExampleB")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
          // Assert on the example value
          .get(".example.microlight")
          .should("include.text", JSON.stringify([1, 2, 3, 4], null, 2))
      })
    })
  })
  describe("/Object", () => {
    describe("in a Parameter", () => {
      ParameterPrimitiveTestCases({
        operationDomId: "#operations-default-post_Object",
        parameterName: "data",
        customUserInput: `{{} "openapiIsCool": true }`,
        customExpectedUrlSubstring: "?openapiIsCool=true",
        exampleA: {
          key: "ObjectExampleA",
          serializedValue:
            "firstName=Kyle&lastName=Shockey&email=kyle.shockey%40smartbear.com",
          value: JSON.stringify(
            {
              firstName: "Kyle",
              lastName: "Shockey",
              email: "kyle.shockey@smartbear.com",
            },
            null,
            2
          ),
        },
        exampleB: {
          key: "ObjectExampleB",
          serializedValue:
            "name=Abbey&type=kitten&color=calico&gender=female&age=11%20weeks",
          value: JSON.stringify(
            {
              name: "Abbey",
              type: "kitten",
              color: "calico",
              gender: "female",
              age: "11 weeks",
            },
            null,
            2
          ),
        },
      })
    })
    describe("in a Request Body", () => {
      const exampleA = JSON.stringify(
        {
          firstName: "Kyle",
          lastName: "Shockey",
          email: "kyle.shockey@smartbear.com",
        },
        null,
        2
      )
      const exampleB = JSON.stringify(
        {
          name: "Abbey",
          type: "kitten",
          color: "calico",
          gender: "female",
          age: "11 weeks",
        },
        null,
        2
      )
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_Object",
        primaryMediaType: "application/json",
        // ↓ not a typo, Cypress requires escaping { when using `cy.type`
        customUserInput: `{{} "openapiIsCool": true }`,
        customExpectedUrlSubstring: "?openapiIsCool=true",
        customUserInputExpectedCurlSubstring: `{ "openapiIsCool": true }`,
        exampleA: {
          key: "ObjectExampleA",
          serializedValue: exampleA,
          value: exampleA,
          summary: "A user's contact info",
        },
        exampleB: {
          key: "ObjectExampleB",
          serializedValue: exampleB,
          value: exampleB,
          summary: "A wonderful kitten's info",
        },
      })
      it("should display an error message when input validation fails", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          // Expand the operation
          .get("#operations-default-post_Object")
          .click()
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Set an invalid value
          .get(
            ".parameters-container > div > table > tbody > tr > td.parameters-col_description > div:nth-child(2) textarea"
          )
          .type("{{{{ [[[[ <<<< invalid JSON here.")
          // Execute the operation
          .get(".execute")
          .click()
          // Verify that an error is shown
          .get(".validation-errors")
          .contains("Parameter string value must be valid JSON")
      })
    })
    describe("in a Response", () => {
      ResponsePrimitiveTestCases({
        operationDomId: "#operations-default-post_Object",
        exampleA: {
          key: "ObjectExampleA",
          value: JSON.stringify(
            {
              firstName: "Kyle",
              lastName: "Shockey",
              email: "kyle.shockey@smartbear.com",
            },
            null,
            2
          ),
          summary: "A user's contact info",
        },
        exampleB: {
          key: "ObjectExampleB",
          value: JSON.stringify(
            {
              name: "Abbey",
              type: "kitten",
              color: "calico",
              gender: "female",
              age: "11 weeks",
            },
            null,
            2
          ),
          summary: "A wonderful kitten's info",
        },
      })
    })
  })
})
