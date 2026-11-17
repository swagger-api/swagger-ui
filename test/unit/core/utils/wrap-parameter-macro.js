import wrapParameterMacro from "core/utils/wrap-parameter-macro"

describe("wrapParameterMacro", function () {
  it("should return the input unchanged if it is not a function", function () {
    expect(wrapParameterMacro(null)).toBe(null)
    expect(wrapParameterMacro(undefined)).toBe(undefined)
  })

  it("should pass through non-undefined return values from the macro", function () {
    const macro = (operation, parameter) => "customValue"
    const wrapped = wrapParameterMacro(macro)

    const result = wrapped({ operationId: "test" }, { name: "param1" })
    expect(result).toBe("customValue")
  })

  it("should return parameter.default when macro returns undefined", function () {
    const macro = (operation, parameter) => {
      if (parameter.name === "wanted") {
        return "overridden"
      }
      // returns undefined for other parameters
    }
    const wrapped = wrapParameterMacro(macro)

    const resultForWanted = wrapped(
      { operationId: "test" },
      { name: "wanted", default: "original" }
    )
    expect(resultForWanted).toBe("overridden")

    const resultForOther = wrapped(
      { operationId: "test" },
      { name: "other", default: "existingDefault" }
    )
    expect(resultForOther).toBe("existingDefault")
  })

  it("should return undefined when macro returns undefined and parameter has no default", function () {
    const macro = () => undefined
    const wrapped = wrapParameterMacro(macro)

    const result = wrapped(
      { operationId: "test" },
      { name: "param1" }
    )
    expect(result).toBe(undefined)
  })

  it("should allow null return values to pass through", function () {
    const macro = () => null
    const wrapped = wrapParameterMacro(macro)

    const result = wrapped(
      { operationId: "test" },
      { name: "param1", default: "existingDefault" }
    )
    expect(result).toBe(null)
  })

  it("should allow empty string return values to pass through", function () {
    const macro = () => ""
    const wrapped = wrapParameterMacro(macro)

    const result = wrapped(
      { operationId: "test" },
      { name: "param1", default: "existingDefault" }
    )
    expect(result).toBe("")
  })

  it("should allow zero return values to pass through", function () {
    const macro = () => 0
    const wrapped = wrapParameterMacro(macro)

    const result = wrapped(
      { operationId: "test" },
      { name: "param1", default: 42 }
    )
    expect(result).toBe(0)
  })

  it("should allow false return values to pass through", function () {
    const macro = () => false
    const wrapped = wrapParameterMacro(macro)

    const result = wrapped(
      { operationId: "test" },
      { name: "param1", default: true }
    )
    expect(result).toBe(false)
  })
})
