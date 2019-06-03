import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"

const Callbacks = (props) => {
  let { callbacks, getComponent, specPath, translate } = props
  // const Markdown = getComponent("Markdown")
  const OperationContainer = getComponent("OperationContainer", true)

  if(!callbacks) {
    return <span>{translate("callbacks.no")}</span>
  }

  let callbackElements = callbacks.map((callback, callbackName) => {
    return <div key={callbackName}>
      <h2>{callbackName}</h2>
      { callback.map((pathItem, pathItemName) => {
        if(pathItemName === "$$ref") {
          return null
        }
        return <div key={pathItemName}>
          { pathItem.map((operation, method) => {
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
              tag={""}
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
  translate: PropTypes.func.isRequired,
}

export default Callbacks
