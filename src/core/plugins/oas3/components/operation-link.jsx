import React, { Component } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

class OperationLink extends Component {
  render() {
    const { link, name, getComponent } = this.props

    const Markdown = getComponent("Markdown", true)

    let targetOp = link.get("operationId") || link.get("operationRef")
    let parameters = link.get("parameters") && link.get("parameters").toJS()
    let description = link.get("description")

    return <div className="operation-link">
      <div className="description">
        <b><code>{name}</code></b>
        { description ? <Markdown source={description}></Markdown> : null }
      </div>
      <pre>
        Operation `{targetOp}`<br /><br />
        Parameters {padString(0, JSON.stringify(parameters, null, 2)) || "{}"}<br />
      </pre>
    </div>
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
  getComponent: PropTypes.func.isRequired,
  link: ImPropTypes.orderedMap.isRequired,
  name: PropTypes.String
}

export default OperationLink
