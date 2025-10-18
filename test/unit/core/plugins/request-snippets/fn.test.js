
const { escapeCMD } = require("../../../../../src/core/plugins/request-snippets/fn")

describe("escapeCMD", function() {
  it("escapes vertical bar | with caret ^ for CMD", function() {
    const input = "foo|bar"
    const output = escapeCMD(input)
    expect(output).toContain("^|")
  })

  it("escapes other CMD special characters", function() {
    expect(escapeCMD("foo^bar")).toContain("^^")
    expect(escapeCMD("foo\"bar")).toContain("\"\"")
  })
})
