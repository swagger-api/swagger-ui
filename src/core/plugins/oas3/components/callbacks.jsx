import React from "react"

export default ({ callbacks, getComponent }) => {
  const Markdown = getComponent("Markdown")

  if(!callbacks) {
    return <span>No callbacks</span>
  }

  let callbackElements = callbacks.map((callback, callbackName) => {
    return <div>
      <h2>{callbackName}</h2>
      { callback.map((pathItem, pathItemName) => {
        return <div>
          <h4>{pathItemName}</h4>
          { pathItem.map((operation, method) => {
            return <pre>{JSON.stringify(operation)}</pre>
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
