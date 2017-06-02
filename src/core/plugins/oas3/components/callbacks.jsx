import React from "react"

export default (props) => {
  let { callbacks, getComponent } = props
  const Markdown = getComponent("Markdown")
  const Operation = getComponent("operation", true)

  if(!callbacks) {
    return <span>No callbacks</span>
  }

  let callbackElements = callbacks.map((callback, callbackName) => {
    return <div>
      <h2>{callbackName}</h2>
      { callback.map((pathItem, pathItemName) => {
        return <div>
          { pathItem.map((operation, method) => {
            return <Operation
              operation={operation}
              key={method}
              method={method}
              path={pathItemName}
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
