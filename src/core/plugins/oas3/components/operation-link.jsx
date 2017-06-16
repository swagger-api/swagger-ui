import React, { Component } from "react"

export default class OperationLink extends Component {
  render() {
    const { link, name } = this.props

    let targetOp = link.get("operationId") || link.get("operationRef")
    let parameters = link.get("parameters") && link.get("parameters").toJS()
    let headers = link.get("headers") && link.get("headers").toJS()
    let description = link.get("description")

    return <span>
      <div style={{ padding: "7px" }}>{name}{description ? `: ${description}` : ""}</div>
      <pre>
        Parameters {padString(0, JSON.stringify(parameters, null, 2)) || "{}"}<br /><br />
      Headers {padString(0, JSON.stringify(headers, null, 2)) || "{}"}<br />
      </pre>
    </span>
  }

}

function padString(n, string) {
  if(typeof string !== "string") { return "" }
  return string
    .split("\n")
    .map((line, i) => i > 0 ? Array(n + 1).join(" ") + line : line)
    .join("\n")
}
