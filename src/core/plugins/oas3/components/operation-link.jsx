import React, { Component } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

class OperationLink extends Component {
  handleFollowLink = (e) => {
    e.preventDefault()
    const { link, oas3Actions, responseContext } = this.props

    const operationId = link.get("operationId")
    const parameters = link.get("parameters")

    if (oas3Actions && oas3Actions.executeLink) {
      oas3Actions.executeLink({
        operationId,
        parameters,
        responseContext,
      })
    }
  }

  render() {
    const { link, name, getComponent } = this.props

    const Markdown = getComponent("Markdown", true)

    let targetOp = link.get("operationId") || link.get("operationRef")
    let parameters = link.get("parameters") && link.get("parameters").toJS()
    let description = link.get("description")

    return (
      <div className="operation-link" style={{ marginBottom: "14px" }}>
        <div className="description" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ wordBreak: "keep-all", overflowWrap: "normal", whiteSpace: "normal" }}>
            <b style={{ wordBreak: "keep-all" }}>
              <code style={{ wordBreak: "keep-all", overflowWrap: "normal", display: "inline" }}>
                {name}
              </code>
            </b>
            { description ? <Markdown source={description}></Markdown> : null }
          </div>
          {link.get("operationId") && (
          <div>
            <button
              type="button"
              className="btn btn-sm execute"
              onClick={this.handleFollowLink}
              style={{ width: "100%", whiteSpace: "nowrap" }}
            >
              Follow Link
            </button>
          </div>
          )}
        </div>
        <pre style={{ marginTop: "6px", wordBreak: "break-word" }}>
          Operation `{targetOp}`<br /><br />
          Parameters {padString(0, JSON.stringify(parameters, null, 2)) || "{}"}<br />
        </pre>
      </div>
    )
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
  name: PropTypes.string,
  oas3Actions: PropTypes.object,
  // The live "Try it out" response for this operation (an Immutable Map
  // with at least a "body" key), when this link's response row is the
  // one that actually matches what came back -- see responseContext in
  // response.jsx/responses.jsx, and executeLink in oas3/actions.js.
  responseContext: ImPropTypes.iterable,
}

export default OperationLink
