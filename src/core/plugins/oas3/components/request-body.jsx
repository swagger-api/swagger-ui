import React from "react"
import { OrderedMap } from "immutable"


export default ({ requestBody, getComponent, specSelectors, contentType }) => {
  const Markdown = getComponent("Markdown")
  const ModelExample = getComponent("modelExample")

  const requestBodyDescription = (requestBody && requestBody.get("description")) || null
  const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()
  contentType = contentType || requestBodyContent.keySeq().first()

  const mediaTypeValue = requestBodyContent.get(contentType)

  return <div>
    { requestBodyDescription &&
      <Markdown source={requestBodyDescription} />
    }
    <ModelExample
      getComponent={ getComponent }
      specSelectors={ specSelectors }
      expandDepth={1}
      schema={mediaTypeValue.get("schema")}
      example={<i>Not yet implemented</i>}/>
  </div>
}
