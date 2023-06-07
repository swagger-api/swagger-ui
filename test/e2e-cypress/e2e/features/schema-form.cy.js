/**
 * @prettier
 */

describe("OpenAPI 3.0 Additional JsonSchemaForm in a Parameter", () => {
  describe("incomplete API definition with missing schema key or schema value(s)", () => {
    describe("parameter exists as global", () => {
      it("should render when parameter exists as global, but missing schema key", () => {
        cy.visit("/?url=/documents/features/schema-form-missing-values.yaml")
          .get("#operations-default-get_case_one_no_schema")
          .click()
          .get(".opblock-description .renderedMarkdown p")
          .should("have.text", "sf")
      })
      it("should render when parameter exists as global, but missing all schema values", () => {
        cy.visit("/?url=/documents/features/schema-form-missing-values.yaml")
          .get("#operations-default-get_case_one_no_type_or_format")
          .click()
          .get(".opblock-description .renderedMarkdown p")
          .should("have.text", "sf")
      })
      it("should render when parameter exists as global, schema key exists, but missing schema values: format", () => {
        cy.visit("/?url=/documents/features/schema-form-missing-values.yaml")
          .get("#operations-default-get_case_one_format_only_no_type")
          .click()
          .get(".opblock-description .renderedMarkdown p")
          .should("have.text", "sf")
      })
      it("should render when parameter exists as global, schema key exists, but missing schema value: type", () => {
        cy.visit("/?url=/documents/features/schema-form-missing-values.yaml")
          .get("#operations-default-get_case_one_type_only_no_format")
          .click()
          .get(".opblock-description .renderedMarkdown p")
          .should("have.text", "sf")
      })
    })
    describe("parameter exists in method", () => {
      it("should render when parameter exists in method, but missing schema key", () => {
        cy.visit("/?url=/documents/features/schema-form-missing-values.yaml")
          .get("#operations-default-get_case_two_no_schema")
          .click()
          .get(".opblock-description .renderedMarkdown p")
          .should("have.text", "sf")
      })
      it("should render when parameter exists in method, schema key exists, but missing all schema values", () => {
        cy.visit("/?url=/documents/features/schema-form-missing-values.yaml")
          .get("#operations-default-get_case_two_no_type_or_format")
          .click()
          .get(".opblock-description .renderedMarkdown p")
          .should("have.text", "sf")
      })
      it("should render when parameter exists in method, schema key exists, but missing schema value: format", () => {
        cy.visit("/?url=/documents/features/schema-form-missing-values.yaml")
          .get("#operations-default-get_case_one_type_only_no_format")
          .click()
          .get(".opblock-description .renderedMarkdown p")
          .should("have.text", "sf")
      })
      it("should render when parameter exists in method, schema key exists, but missing schema value: type", () => {
        cy.visit("/?url=/documents/features/schema-form-missing-values.yaml")
          .get("#operations-default-get_case_one_format_only_no_type")
          .click()
          .get(".opblock-description .renderedMarkdown p")
          .should("have.text", "sf")
      })
    })
  })
  describe("/Array", () => {
    describe("in a Parameter", () => {
      it("should allow modification of values in Try-It-Out", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Expand Try It Out
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
      it("should allow removal of added value in Try-It-Out", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Expand Try It Out
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
          // Remove the last item that was just added
          .get(
            ".json-schema-form-item:last-of-type > .json-schema-form-item-remove"
          )
          .click()
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "2",
              "3",
              "4",
            ])
          })
      })
      it("should allow removal of nth of values in Try-It-Out", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Expand Try It Out
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
          // Remove the second item in list
          .get(
            ".json-schema-form-item:nth-child(2) > .json-schema-form-item-remove"
          )
          .click()
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "1",
              "3",
              "4",
              "5",
            ])
          })
      })
      it("should allow execution of operation in Try-It-Out", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          .get(".parameters-col_description .examples-select > select")
          .select("ArrayExampleB")
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
      })
      it("should add empty item and allow execution of operation in Try-It-Out", () => {
        cy.visit(
          "/?url=/documents/features/multiple-examples-core.openapi.yaml"
        )
          .get("#operations-default-post_Array")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          .get(".parameters-col_description .examples-select > select")
          .select("ArrayExampleB")
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          // Execute without prior typing a value
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
      })
    })
  })
  describe("Petstore", () => {
    describe("/pet/findByStatus", () => {
      it("should render the operation, execute with default value", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-default-findPetsByStatus")
          .click()
          // Expand operation
          .get(".opblock-title span")
          .should("have.text", "Parameters")
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "available")
      })
      it("should render the operation, modify value, and execute with modified value", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-default-findPetsByStatus")
          .click()
          // Expand operation
          .get(".opblock-title span")
          .should("have.text", "Parameters")
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Select
          .get(".parameters-col_description > select")
          .select("pending")
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "pending")
      })
    })
    describe("/pet/findByTags", () => {
      it("should allow modification of values in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-pet-findPetsByTags")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item > input")
          .type("{selectall}spotted")
          .blur()
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
            ])
          })
      })
      it("should allow removal of added value in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-pet-findPetsByTags")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}spotted")
          .blur()
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
            ])
          })
          // Remove the last item that was just added
          .get(
            ".json-schema-form-item:last-of-type > .json-schema-form-item-remove"
          )
          .click()
          .get(".json-schema-form-item > input")
          .should("not.exist")
      })
      it("should allow removal of nth of values in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-pet-findPetsByTags")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}spotted")
          .blur()
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
            ])
          })
          // Add a 2nd new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}large")
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
              "large",
            ])
          })
          // Add a 3rd new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}puppy")
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
              "large",
              "puppy",
            ])
          })
          // Remove the second item in list
          .get(
            ".json-schema-form-item:nth-child(2) > .json-schema-form-item-remove"
          )
          .click()
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
              "puppy",
            ])
          })
      })
      it("should allow execution of operation without modifications in Try-It-Out (debounce)", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-pet-findPetsByTags")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "findByTags")
      })
      it("should add empty item and allow execution of operation in Try-It-Out (debounce)", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-pet-findPetsByTags")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          // Execute without prior typing a value
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "findByTags")
      })
      it("should add modified item and allow execution of operation in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-pet-findPetsByTags")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item > input")
          .type("{selectall}spotted")
          .blur()
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
            ])
          })
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "spotted")
      })
      it("should add 3 modified items, remove the middle child, and allow execution of operation Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-pet-findPetsByTags")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Add a new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}spotted")
          .blur()
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
            ])
          })
          // Add a 2nd new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}large")
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
              "large",
            ])
          })
          // Add a 3rd new item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > input")
          .type("{selectall}puppy")
          // Assert against the input fields
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
              "large",
              "puppy",
            ])
          })
          // Remove the second item in list
          .get(
            ".json-schema-form-item:nth-child(2) > .json-schema-form-item-remove"
          )
          .click()
          .get(".json-schema-form-item > input")
          .then((inputs) => {
            expect(inputs.map((i, el) => el.value).toArray()).to.deep.equal([
              "spotted",
              "puppy",
            ])
          })
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "tags=spotted&tags=puppy")
          .should("not.have.text", "large")
      })
    })
    describe("/petOwner/{petOwnerId}", () => {
      // This is a (GET) debounce test for schema type: string
      it("should render the operation, and allow execute of operation with empty value (debounce)", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-getPetOwnerById")
          .click()
          // Expand operation
          .get(".opblock-title span")
          .should("have.text", "Parameters")
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "petOwner")
      })
      it("should render the operation, and input field, and allow execute of operation", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-getPetOwnerById")
          .click()
          // Expand operation
          .get(".opblock-title span")
          .should("have.text", "Parameters")
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          .get(".parameters-col_description > input")
          .type("123")
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "petOwner")
          .should("contain.text", "123")
      })
    })
    describe("/petOwner/listOfServiceTrainer", () => {
      it("should allow execution of operation with value=true in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-listOfServiceTrainer")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // add 1st item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item > select")
          .select("true")
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "tags=true")
      })
      it("should allow execution of operation with value=false in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-listOfServiceTrainer")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // add 1st item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item > select")
          .select("false")
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "tags=false")
      })
      it("should allow execution of operation with value=true&value=false in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-listOfServiceTrainer")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // add 1st item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item > select")
          .select("true")
          // add 2nd item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > select")
          .select("false")
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "tags=true&tags=false")
      })
      it("should allow execution of operation with value=false after removing value=true in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-listOfServiceTrainer")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // add 1st item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item > select")
          .select("true")
          // add 2nd item
          .get(".json-schema-form-item-add")
          .click()
          .get(".json-schema-form-item:last-of-type > select")
          .select("false")
          // remove 1st item
          .get(
            ".json-schema-form-item:nth-child(1) > .json-schema-form-item-remove"
          )
          .click()
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "tags=false")
      })
      it("should allow execution of operation with value=(empty) in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-listOfServiceTrainer")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "listOfServiceTrainer")
      })
    })
    describe("/petOwner/findByPreference", () => {
      it("should allow execution of operation with value=(empty) in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-findByPreference")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "findByPreference")
      })
      it("should allow execution of operation with selected value in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-findByPreference")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Select
          .get(".parameters-col_description > select")
          .select("dog")
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "findByPreference")
          .should("contain.text", "dog")
      })
      it("should allow execution of operation with multiple selected values in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-findByPreference")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Select
          .get(".parameters-col_description > select")
          .select(["dog", "cat"])
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "findByPreference")
          .should("contain.text", "dog")
          .should("contain.text", "cat")
      })
    })
    describe("/petOwner/createWithList", () => {
      it("should allow execution of operation with default text in textArea in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-petOwnerCreateWithList")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "createWithList")
      })
      it("should allow execution of operation with cleared textArea in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-petOwnerCreateWithList")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          .get(".body-param__text")
          .clear()
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "createWithList")
      })
      it("should allow execution of operation with modified textArea in Try-It-Out", () => {
        cy.visit("/?url=/documents/features/schema-form-core.yaml")
          .get("#operations-petOwner-petOwnerCreateWithList")
          .click()
          // Expand Try It Out
          .get(".try-out__btn")
          .click()
          .get(".body-param__text")
          .clear()
          // note: adding this much type adds 6+ seconds to test
          .type(
            `[
              {
                "id": 10,
                "petId": 201,
                "petOwnerFirstName": "John",
              },
              {
                "id": 11,
                "petId": 201,
                "petOwnerFirstName": "Jane",
              }
            ]`
          )
          .should("contain.text", "Jane")
          .should("contain.text", "201")
          // Execute
          .get(".execute.opblock-control__btn")
          .click()
          // Expect new element to be visible after Execute
          .get(".btn-clear.opblock-control__btn")
          .should("have.text", "Clear")
          // Compare Request URL
          .get(".request-url pre.microlight")
          .should("contain.text", "createWithList")
          // Compare Curl
          .get(".curl")
          .should("contain.text", "Jane")
          .should("contain.text", "201")
      })
    })
  })
})
