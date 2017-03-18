import React, { PropTypes } from "react"

export default function (system) {
  return {
    components: {
      NoHostWarning,
    },
    statePlugins: {
      spec: {
        selectors: {
          allowTryItOutFor,
        }
      }
    }
  }
}

// This is a quick style. How do we improve this?
const style = {
  backgroundColor: "#e7f0f7",
  padding: "1rem",
  borderRadius: "3px",
}

function NoHostWarning() {
  return (
    <div style={style}>Note: The interactive forms are disabled, as no `host` property was found in the specification.  Please see: <a href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#swagger-object" target="_blank">OAI 2.0/#swagger-object</a></div>
  )
}

// Only allow if, there is a host field
function allowTryItOutFor(state) {
  return ({specSelectors}) => {
    return specSelectors.hasHost(state)
  }
}
