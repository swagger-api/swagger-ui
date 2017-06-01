import React from "react"
import { OrderedMap } from "immutable"


export default ({ requestBody, getComponent, specSelectors }) => {
  const Markdown = getComponent("Markdown")
  const Model = getComponent("model")

  const requestBodyDescription = (requestBody && requestBody.get("description")) || null
  const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()

  return <div>
    { requestBodyDescription &&
      <p>{requestBodyDescription}</p>
    }
    { !requestBodyContent.count() ? <p>No content</p> :
      requestBodyContent.map((mediaTypeValue, key) => (
        <div>
          <h4>{key}</h4>
          <Model
            getComponent={ getComponent }
            specSelectors={ specSelectors }
            expandDepth={1}
            schema={mediaTypeValue.get("schema")} />
        </div>
      )).toArray()
    }
  </div>
}
