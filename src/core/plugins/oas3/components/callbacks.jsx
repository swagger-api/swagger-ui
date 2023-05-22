import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"

const Callbacks = (props) => {
  let { callbacks, getComponent, specPath } = props
  // const Markdown = getComponent("Markdown", true)
  const OperationContainer = getComponent("OperationContainer", true)

  if(!callbacks) {
    return <span>No callbacks</span>
  }

  let callbackElements = callbacks.entrySeq().map(([callbackName, callback]) => {
    return <div key={callbackName}>
      <h2>{callbackName}</h2>
      { callback.entrySeq().map(([pathItemName, pathItem]) => {
        if(pathItemName === "$$ref") {
          return null
        }
        return <div key={pathItemName}>
          { pathItem.entrySeq().map(([method, operation]) => {
            if(method === "$$ref") {
              return null
            }
            let op = fromJS({
              operation
            })
            return <OperationContainer
              {...props}
              op={op}
              key={method}
              tag="callbacks"
              method={method}
              path={pathItemName}
              specPath={specPath.push(callbackName, pathItemName, method)}
              allowTryItOut={false}
              />
          }) }
        </div>
      }) }
    </div>
  })
  return <div>
    {callbackElements}
  </div>
}

Callbacks.propTypes = {
  getComponent: PropTypes.func.isRequired,
  callbacks: ImPropTypes.iterable.isRequired,
  specPath: ImPropTypes.list.isRequired,
}

export default Callbacks
