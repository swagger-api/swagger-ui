import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { OrderedMap } from "immutable"
import { getSampleSchema } from "core/utils"
import { memoizedGetExamples } from "core/plugins/oas3/utils"

const RequestBody = ({ requestBody, getComponent, specSelectors, contentType }) => {
  const Markdown = getComponent("Markdown")
  const ModelExample = getComponent("modelExample")
  const HighlightCode = getComponent("highlightCode")

  const requestBodyDescription = (requestBody && requestBody.get("description")) || null
  const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()
  contentType = contentType || requestBodyContent.keySeq().first()

  const mediaTypeValue = requestBodyContent.get(contentType)

  const sampleSchema = getSampleSchema(mediaTypeValue.get("schema").toJS(), contentType, {
    includeWriteOnly: true
  })

  const examples = memoizedGetExamples(mediaTypeValue.get("examples"))

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
      examples={examples}
      />
  </div>
}

RequestBody.propTypes = {
  requestBody: ImPropTypes.orderedMap.isRequired,
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.object.isRequired,
  contentType: PropTypes.string.isRequired
}

export default RequestBody
