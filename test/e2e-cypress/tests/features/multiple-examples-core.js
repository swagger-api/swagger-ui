/**
 * @prettier
 */

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
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Boolean")
          .click()
          // Assert on the initial dropdown value
          .get("table.parameters select.examples-control")
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
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Boolean")
          .click()
          // Set the dropdown value, then assert on it
          .get("table.parameters select.examples-control")
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
        cy
          .visit(
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
          .get("table.parameters select.examples-control")
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
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Boolean")
          .click()
          // Assert on the initial dropdown value
          .get(".responses-wrapper select.examples-control")
          .find(":selected")
          .should("have.text", "The truth will set you free")
          // Assert on the example value
          .get(".example.microlight")
          .should("have.text", "true")
      })
      it("should render and apply the second value when chosen", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Boolean")
          .click()
          // Set the dropdown value, then assert on it
          .get(".responses-wrapper select.examples-control")
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
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          .get(".json-schema-form-item > input")
          .then(inputs => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "a",
              "b",
              "c",
            ])
          })
          .get(".parameters-col_description .examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of strings")
      })
      it("should switch to the second array's entries via dropdown", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          .get(".parameters-col_description .examples-control")
          .select("ArrayExampleB")
          .get(".json-schema-form-item > input")
          .then(inputs => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
            ])
          })
          .get(".parameters-col_description .examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
      })
      it("should not allow modification of values in static mode", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          .get(".parameters-col_description .examples-control")
          .select("ArrayExampleB")
          // Add a new item
          .get(".json-schema-form-item > input")
          .should("have.attr", "disabled")
      })
      it("should allow modification of values in Try-It-Out", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          .get(".try-out__btn")
          .click()
          .get(".parameters-col_description .examples-control")
          .select("ArrayExampleB")
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("5")
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then(inputs => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
              "5",
            ])
          })
          .get(".parameters-col_description .examples-control")
          .find(":selected")
          .should("have.text", "[Modified value]")
      })

      it("should retain a modified value, and support returning to it", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          .get(".try-out__btn")
          .click()
          .get(".parameters-col_description .examples-control")
          .select("ArrayExampleB")
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("5")
          // Reset to an example
          .get(".parameters-col_description .examples-control")
          .select("ArrayExampleB")
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then(inputs => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
            ])
          })
          .get(".parameters-col_description .examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
          // Return to the modified value
          .get(".parameters-col_description .examples-control")
          .select("__MODIFIED__VALUE__")
          // Assert that our modified value is back
          .get(".json-schema-form-item > input")
          .then(inputs => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
              "5",
            ])
          })
          .get(".parameters-col_description .examples-control")
          .find(":selected")
          .should("have.text", "[Modified value]")
      })
    })
    describe("in a Request Body", () => {
      it("should have the first example's array entries by default", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          // Check HighlightCode value
          .get(".opblock-section-request-body .highlight-code")
          .should("have.text", JSON.stringify(["a", "b", "c"], null, 2))
          // Check dropdown value
          .get(".opblock-section-request-body .examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of strings")
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("have.value", JSON.stringify(["a", "b", "c"], null, 2))
          // Check dropdown value
          .get(".opblock-section-request-body .examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of strings")
      })
      it("should switch to the second array's entries via dropdown", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          .get(".opblock-section-request-body .examples-control")
          .select("ArrayExampleB")
          .get(".opblock-section-request-body .highlight-code")
          .should("have.text", JSON.stringify([1, 2, 3, 4], null, 2))
          .get(".opblock-section-request-body .examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("have.text", JSON.stringify([1, 2, 3, 4], null, 2))
          // Check dropdown value
          .get(".opblock-section-request-body .examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
      })
      it("should allow modification of values", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Choose the second example
          .get(".opblock-section-request-body .examples-control")
          .select("ArrayExampleB")
          // Change the value
          .get(".opblock-section-request-body textarea")
          .type(`{leftarrow}{leftarrow},{enter}  5`)
          // Check that [Modified value] is displayed in dropdown
          .get(".opblock-section-request-body .examples-control")
          .find(":selected")
          .should("have.text", "[Modified value]")
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("have.text", JSON.stringify([1, 2, 3, 4, 5], null, 2))
      })

      it("should retain a modified value, and support returning to it", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          // Switch to Try-It-Out
          .get(".try-out__btn")
          .click()
          // Choose the second example as the example to start with
          .get(".opblock-section-request-body .examples-control")
          .select("ArrayExampleB")
          // Change the value
          .get(".opblock-section-request-body textarea")
          .type(`{leftarrow}{leftarrow},{enter}  5`)
          // Check that [Modified value] is displayed in dropdown
          .get(".opblock-section-request-body .examples-control")
          .find(":selected")
          .should("have.text", "[Modified value]")
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("have.text", JSON.stringify([1, 2, 3, 4, 5], null, 2))
          // Choose the second example
          .get(".opblock-section-request-body .examples-control")
          .select("ArrayExampleB")
          // Check that the example is displayed in dropdown
          .get(".opblock-section-request-body .examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("have.text", JSON.stringify([1, 2, 3, 4], null, 2))
          // Switch back to the modified value
          .get(".opblock-section-request-body .examples-control")
          .select("__MODIFIED__VALUE__")
          // Check textarea value
          .get(".opblock-section-request-body textarea")
          .should("have.text", JSON.stringify([1, 2, 3, 4, 5], null, 2))
      })
    })
    describe("in a Response", () => {
      it("should render and apply the first example and value by default", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          // Assert on the initial dropdown value
          .get(".responses-wrapper select.examples-control")
          .find(":selected")
          .should("have.text", "A lowly array of strings")
          // Assert on the example value
          .get(".example.microlight")
          .should("have.text", JSON.stringify(["a", "b", "c"], null, 2))
      })
      it("should render and apply the second value when chosen", () => {
        cy
          .visit(
            "/?url=/documents/features/multiple-examples-core.openapi.yaml"
          )
          .get("#operations-default-post_Array")
          .click()
          // Set the dropdown value, then assert on it
          .get(".responses-wrapper select.examples-control")
          .select("ArrayExampleB")
          .find(":selected")
          .should("have.text", "A lowly array of numbers")
          // Assert on the example value
          .get(".example.microlight")
          .should("have.text", JSON.stringify([1, 2, 3, 4], null, 2))
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
      RequestBodyPrimitiveTestCases({
        operationDomId: "#operations-default-post_Object",
        primaryMediaType: "application/json",
        // ↓ not a typo, Cypress requires escaping { when using `cy.type`
        customUserInput: `{{} "openapiIsCool": true }`,
        customExpectedUrlSubstring: "?openapiIsCool=true",
        customUserInputExpectedCurlSubstring: `{\\"openapiIsCool\\":true}`,
        exampleA: {
          key: "ObjectExampleA",
          serializedValue: `{\\"firstName\\":\\"Kyle\\",\\"lastName\\":\\"Shockey\\",\\"email\\":\\"kyle.shockey@smartbear.com\\"}`,
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
          serializedValue: `{\\"name\\":\\"Abbey\\",\\"type\\":\\"kitten\\",\\"color\\":\\"calico\\",\\"gender\\":\\"female\\",\\"age\\":\\"11 weeks\\"}`,
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
})

function ParameterPrimitiveTestCases({
  operationDomId,
  parameterName,
  exampleA, // { value, key }
  exampleB, // { value, key }
  exampleC,
  customUserInput,
  customExpectedUrlSubstring,
}) {
  it("should render examples options without Modified Value by default", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      .get(operationDomId)
      .click()
      .get(`tr[data-param-name=\"${parameterName}\"]`)
      .find(".examples-control option")
      .should("have.length", exampleC ? 3 : 2)
      // Ensure the relevant input is disabled
      .get(
        `tr[data-param-name="${parameterName}"] input, tr[data-param-name="${parameterName}"] textarea`
      )
      .should("have.attr", "disabled")
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      .get(`.opblock-section-request-body`)
      .find(".examples-control option")
      .should("have.length", exampleC ? 3 : 2)
  })

  it("should set default static and Try-It-Out values based on the first member", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Assert on the static docs value
      .get(
        `tr[data-param-name="${parameterName}"] input,tr[data-param-name="${parameterName}"] textarea`
      )
      .should("have.value", exampleA.value)
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Assert on the Try-It-Out value
      .get(
        `tr[data-param-name="${parameterName}"] input,tr[data-param-name="${parameterName}"] textarea`
      )
      .should("have.value", exampleA.value)
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      .get(".request-url")
      .contains(
        exampleA.serializedValue || `?message=${escape(exampleA.value)}`
      )
  })

  it("should set static and Try-It-Out values based on the second member", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Choose the second example
      .get("table.parameters select.examples-control")
      .select(exampleB.key)
      // Assert on the static docs value
      .get(
        `tr[data-param-name="${parameterName}"] input,tr[data-param-name="${parameterName}"] textarea`
      )
      .should("have.value", exampleB.value)
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Assert on the Try-It-Out value
      .get(
        `tr[data-param-name="${parameterName}"] input,tr[data-param-name="${parameterName}"] textarea`
      )
      .should("have.value", exampleB.value)
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      .get(".request-url")
      .contains(
        exampleB.serializedValue
          ? `?${exampleB.serializedValue}`
          : `?message=${escape(exampleB.value)}`
      )
  })

  it("should handle user-entered values correctly", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Modify the input value
      .get(
        `tr[data-param-name="${parameterName}"] input,tr[data-param-name="${parameterName}"] textarea`
      )
      .clear()
      .type(customUserInput)
      // Assert on the active select menu item
      .get("table.parameters select.examples-control")
      .find(":selected")
      .should("have.text", "[Modified value]")
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      .get(".request-url")
      .contains(
        customExpectedUrlSubstring || `?message=${escape(customUserInput)}`
      )
  })

  it("should retain user-entered values correctly", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Modify the input value
      .get(
        `tr[data-param-name="${parameterName}"] input,tr[data-param-name="${parameterName}"] textarea`
      )
      .clear()
      .type(customUserInput)
      // Select the first example
      .get("table.parameters select.examples-control")
      .select(exampleA.key)
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      .get(".request-url")
      .contains(
        exampleA.serializedValue
          ? `?${exampleA.serializedValue}`
          : `?message=${escape(exampleA.value)}`
      )
      // Select the modified value
      .get("table.parameters select.examples-control")
      .select("__MODIFIED__VALUE__")
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      .get(".request-url")
      .contains(
        customExpectedUrlSubstring || `?message=${escape(customUserInput)}`
      )
  })
}

function RequestBodyPrimitiveTestCases({
  operationDomId,
  exampleA, // { value, key, summary }
  exampleB, // { value, key, summary }
  exampleC,
  customUserInput,
  customUserInputExpectedCurlSubstring,
  primaryMediaType = "text/plain",
  secondaryMediaType = "text/plain+other",
}) {
  it("should render examples options without Modified Value by default", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      .get(operationDomId)
      .click()
      .get(`.opblock-section-request-body`)
      .find(".examples-control option")
      .should("have.length", exampleC ? 3 : 2)
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      .get(`.opblock-section-request-body`)
      .find(".examples-control option")
      .should("have.length", exampleC ? 3 : 2)
  })

  it("should set default static and Try-It-Out values based on the first member", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleA.value)
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Assert on the Try-It-Out value
      .get(`.opblock-section-request-body textarea`)
      .should("have.value", exampleA.value)
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the curl body
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(`-d "${exampleA.serializedValue || exampleA.value}"`)
  })

  it("should set default static and Try-It-Out values based on choosing the second member in static mode", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Choose the second example
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleB.key)
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleB.value)
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Assert on the Try-It-Out value
      .get(`.opblock-section-request-body textarea`)
      .should("have.value", exampleB.value)
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(`-d "${exampleB.serializedValue || exampleB.value}"`)
  })

  it("should set default static and Try-It-Out values based on choosing the second member in Try-It-Out mode", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Choose the second example
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleB.key)
      // Assert on the Try-It-Out value
      .get(`.opblock-section-request-body textarea`)
      .should("have.value", exampleB.value)
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(`-d "${exampleB.serializedValue || exampleB.value}"`)
      // Switch to static docs
      .get(".try-out__btn")
      .click()
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleB.value)
  })

  it("should return the dropdown entry for an example when manually returning to its value", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleA.value)
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Assert on the Try-It-Out value
      .get(`.opblock-section-request-body textarea`)
      .should("have.value", exampleA.value)
      // Clear the Try-It-Out value, replace it with custom value
      .clear()
      .type(customUserInput)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", "[Modified value]")
      // Modify the value again, going back to the example value
      .get(`.opblock-section-request-body textarea`)
      .clear()
      .type(exampleA.value)
      // Assert on the dropdown value returning to the example value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleA.summary)
  })

  it("should retain choosing a member in static docs when changing the media type", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Choose the second example
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleB.key)
      // Change the media type
      .get(".opblock-section-request-body .content-type")
      .select(secondaryMediaType)
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleB.value)
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Assert on the Try-It-Out value
      .get(`.opblock-section-request-body textarea`)
      .should("have.value", exampleB.value)
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(`-d "${exampleB.serializedValue || exampleB.value}"`)
  })

  it("should use the first example for the media type when changing the media type without prior interactions with the value", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Change the media type
      .get(".opblock-section-request-body .content-type")
      .select(secondaryMediaType)
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleA.value)
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Assert on the Try-It-Out value
      .get(`.opblock-section-request-body textarea`)
      .should("have.value", exampleA.value)
      // Execute the operation
      .get(".execute")
      .click()
      // Assert on the request URL
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(`-d "${exampleA.serializedValue || exampleA.value}"`)
  })

  it("static mode toggling: mediaType -> example -> mediaType -> example", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Change the media type
      .get(".opblock-section-request-body .content-type")
      .select(secondaryMediaType)
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleA.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleA.summary)

      // Choose exampleB
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleB.key)
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleB.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleB.summary)

      // Change the media type
      .get(".opblock-section-request-body .content-type")
      .select(primaryMediaType)
      // Assert that the static docs value didn't change
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleB.value)
      // Assert that the dropdown value didn't change
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleB.summary)

      // Choose exampleA
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleA.key)
      // Assert on the static docs value
      .get(`.opblock-section-request-body .microlight`)
      .should("have.text", exampleA.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleA.summary)
  })

  it("Try-It-Out toggling: mediaType -> example -> mediaType -> example", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Change the media type
      .get(".opblock-section-request-body .content-type")
      .select(secondaryMediaType)
      // Assert on the static docs value
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", exampleA.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleA.summary)

      // Choose exampleB
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleB.key)
      // Assert on the static docs value
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", exampleB.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleB.summary)

      // Change the media type
      .get(".opblock-section-request-body .content-type")
      .select(primaryMediaType)
      // Assert that the static docs value didn't change
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", exampleB.value)
      // Assert that the dropdown value didn't change
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleB.summary)

      // Choose exampleA
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleA.key)
      // Assert on the static docs value
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", exampleA.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleA.summary)
  })

  it("Try-It-Out toggling and execution with modified values: mediaType -> modified value -> example -> mediaType -> example", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      // Expand the operation
      .get(operationDomId)
      .click()
      // Switch to Try-It-Out
      .get(".try-out__btn")
      .click()
      // Change the media type
      .get(".opblock-section-request-body .content-type")
      .select(secondaryMediaType)
      // Assert on the static docs value
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", exampleA.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleA.summary)

      // Modify the value
      .get(`.opblock-section-request-body textarea`)
      .clear()
      .type(customUserInput)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", "[Modified value]")
      // Fire the operation
      .get(".execute")
      .click()
      // Assert on the curl body
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(
        `-d "${customUserInputExpectedCurlSubstring || customUserInput}"`
      )

      // Choose exampleB
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleB.key)
      // Assert on the static docs value
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", exampleB.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleB.summary)
      // Fire the operation
      .get(".execute")
      .click()
      // Assert on the curl body
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(`-d "${exampleB.serializedValue || exampleB.value}"`)

      // Ensure the modified value is still accessible
      .get(".opblock-section-request-body select.examples-control")
      .contains("[Modified value]")

      // Change the media type to text/plain
      .get(".opblock-section-request-body .content-type")
      .select(primaryMediaType)
      // Assert that the static docs value didn't change
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", exampleB.value)
      // Assert that the dropdown value didn't change
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleB.summary)
      // Fire the operation
      .get(".execute")
      .click()
      // Assert on the curl body
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(`-d "${exampleB.serializedValue || exampleB.value}"`)

      // Ensure the modified value is still accessible
      .get(".opblock-section-request-body select.examples-control")
      .contains("[Modified value]")

      // Choose exampleA
      .get(".opblock-section-request-body select.examples-control")
      .select(exampleA.key)
      // Assert on the static docs value
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", exampleA.value)
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", exampleA.summary)
      // Fire the operation
      .get(".execute")
      .click()
      // Assert on the curl body
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(`-d "${exampleA.serializedValue || exampleA.value}"`)

      // Ensure the modified value is still the same value
      .get(".opblock-section-request-body select.examples-control")
      .select("__MODIFIED__VALUE__")
      // Assert on the static docs value
      .get(`.opblock-section-request-body textarea`)
      .should("have.text", customUserInput.replace(/{{}/g, "{"))
      // Assert on the dropdown value
      .get(".opblock-section-request-body select.examples-control")
      .find(":selected")
      .should("have.text", "[Modified value]")
      // Fire the operation
      .get(".execute")
      .click()
      // Assert on the curl body
      // TODO: use an interceptor instead of curl
      .get(".curl")
      .contains(
        `-d "${customUserInputExpectedCurlSubstring || customUserInput}"`
      )
  })

  // TODO: Try-It-Out + Try-It-Out media type changes
}

function ResponsePrimitiveTestCases({
  operationDomId,
  exampleA, // { value, key, summary }
  exampleB, // { value, key, summary }
  exampleC, // { value, key, summary }
}) {
  it("should render the first example by default", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      .get(operationDomId)
      .click()
      .get(".responses-wrapper")
      .within(() => {
        cy
          .get(".examples-control")
          .find(":selected")
          .should("have.text", exampleA.summary)
          .get(".microlight")
          .should("have.text", exampleA.value)
      })
  })
  it("should render the second example", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      .get(operationDomId)
      .click()
      .get(".responses-wrapper")
      .within(() => {
        cy
          .get(".examples-control")
          .select(exampleB.key)
          .find(":selected")
          .should("have.text", exampleB.summary)
          .get(".microlight")
          .should("have.text", exampleB.value)
      })
  })

  it("should retain an example choice across media types if they share the same example", () => {
    cy
      .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
      .get(operationDomId)
      .click()
      .get(".responses-wrapper")
      .within(() => {
        cy
          // Change examples
          .get(".examples-control")
          .select(exampleB.key)
          // Assert against dropdown value
          .find(":selected")
          .should("have.text", exampleB.summary)
          // Assert against example value
          .get(".microlight")
          .should("have.text", exampleB.value)

          // Change media types
          .get(".content-type")
          .select("text/plain+other")
          // Assert against dropdown value
          .get(".examples-control")
          .find(":selected")
          .should("have.text", exampleB.summary)
          // Assert against example value
          .get(".microlight")
          .should("have.text", exampleB.value)
      })
  })
  ;(exampleC ? it : it.skip)(
    "should reset to the first example if the new media type lacks the current example",
    () => {
      cy
        .visit("/?url=/documents/features/multiple-examples-core.openapi.yaml")
        .get(operationDomId)
        .click()
        .get(".responses-wrapper")
        .within(() => {
          cy
            // Change media types
            .get(".content-type")
            .select("text/plain+other")
            // Change examples
            .get(".examples-control")
            .select(exampleC.key)
            // Assert against dropdown value
            .find(":selected")
            .should("have.text", exampleC.summary || exampleC.key)
            // Assert against example value
            .get(".microlight")
            .should("have.text", exampleC.value)

            // Change media types
            .get(".content-type")
            .select("text/plain")
            // Assert against dropdown value
            .get(".examples-control")
            .find(":selected")
            .should("have.text", exampleA.summary)
            // Assert against example value
            .get(".microlight")
            .should("have.text", exampleA.value)
        })
    }
  )
}
