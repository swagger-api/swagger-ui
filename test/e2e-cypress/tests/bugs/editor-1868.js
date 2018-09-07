import repeat from "lodash/repeat"

describe("Editor #1868: model changes break rendering", () => {
  it("should render model content changes correctly", () => {
    cy
      .visit("/?url=/documents/bugs/editor-1868.yaml")

      .get(".model-toggle.collapsed")
      .click()

      .get("#model-MyModel")
      .contains("a")

      .window()
      .then(win => {
        // Simulate Swagger Editor updating a model
        const content = win.ui.specSelectors.specStr()
        win.ui.specActions.updateSpec(content + `\n      b:\n        type: string`)
      })

      .get("#model-MyModel")
      .contains("a")
      .get("#model-MyModel")
      .contains("b")
  })
})