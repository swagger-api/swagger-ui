import React, { Component } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

class OperationLink extends Component {
  render() {
    const { link, name } = this.props

    let targetOp = link.get("operationId") || link.get("operationRef")
    let parameters = link.get("parameters") && link.get("parameters").toJS()
    let description = link.get("description")

    return <span>
      <div style={{ padding: "5px 2px" }}>{name}{description ? `: ${description}` : ""}</div>
      <pre>
        Operation `{targetOp}`<br /><br />
        Parameters {padString(0, JSON.stringify(parameters, null, 2)) || "{}"}<br />
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

OperationLink.propTypes = {
  link: ImPropTypes.orderedMap.isRequired,
  name: PropTypes.String
}

export default OperationLink
