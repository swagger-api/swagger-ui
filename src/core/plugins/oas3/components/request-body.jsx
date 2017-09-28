import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { OrderedMap } from "immutable"

const RequestBody = ({
  requestBody,
  getComponent,
  specSelectors,
  contentType,
  isExecute,
  onChange
}) => {
  const Markdown = getComponent("Markdown")
  const ModelExample = getComponent("modelExample")
  const RequestBodyEditor = getComponent("RequestBodyEditor")

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
      isExecute={isExecute}
      schema={mediaTypeValue.get("schema")}
      example={<RequestBodyEditor
        requestBody={requestBody}
        onChange={onChange}
        mediaType={contentType}
        getComponent={getComponent}
        isExecute={isExecute}
        specSelectors={specSelectors}
        />}
      />
  </div>
}

RequestBody.propTypes = {
  requestBody: ImPropTypes.orderedMap.isRequired,
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.object.isRequired,
  contentType: PropTypes.string.isRequired,
  isExecute: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default RequestBody
