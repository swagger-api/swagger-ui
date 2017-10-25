import React from "react"
import PropTypes from "prop-types"

const Callbacks = (props) => {
  let { callbacks, getComponent } = props
  // const Markdown = getComponent("Markdown")
  const Operation = getComponent("operation", true)

  if(!callbacks) {
    return <span>No callbacks</span>
  }

  let callbackElements = callbacks.map((callback, callbackName) => {
    return <div key={callbackName}>
      <h2>{callbackName}</h2>
      { callback.map((pathItem, pathItemName) => {
        return <div key={pathItemName}>
          { pathItem.map((operation, method) => {
            return <Operation
              operation={operation}
              key={method}
              method={method}
              isShownKey={["callbacks", operation.get("id"), callbackName]}
              path={pathItemName}
              allowTryItOut={false}
              {...props}></Operation>
            // return <pre>{JSON.stringify(operation)}</pre>
          }) }
        </div>
      }) }
    </div>
    // return <div>
    //   <h2>{name}</h2>
    //   {callback.description && <Markdown source={callback.description}/>}
    //   <pre>{JSON.stringify(callback)}</pre>
    // </div>
  })
  return <div>
    {callbackElements}
  </div>
}

Callbacks.propTypes = {
  getComponent: PropTypes.func.isRequired,
  callbacks: PropTypes.array.isRequired

}

export default Callbacks
