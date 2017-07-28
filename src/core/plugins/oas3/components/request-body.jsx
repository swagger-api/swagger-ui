import React from "react"
import { OrderedMap } from "immutable"
import { getSampleSchema } from "core/utils"


export default ({ requestBody, getComponent, specSelectors, contentType }) => {
  const Markdown = getComponent("Markdown")
  const ModelExample = getComponent("modelExample")
  const HighlightCode = getComponent("highlightCode")

  const requestBodyDescription = (requestBody && requestBody.get("description")) || null
  const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()
  contentType = contentType || requestBodyContent.keySeq().first()

  const mediaTypeValue = requestBodyContent.get(contentType)

  const sampleSchema = getSampleSchema(mediaTypeValue.get("schema").toJS(), contentType)

  return <div>
    { requestBodyDescription &&
      <Markdown source={requestBodyDescription} />
    }
    <ModelExample
      getComponent={ getComponent }
      specSelectors={ specSelectors }
      expandDepth={1}
      schema={mediaTypeValue.get("schema")}
      example={<HighlightCode value={sampleSchema} />}
      />
  </div>
}
