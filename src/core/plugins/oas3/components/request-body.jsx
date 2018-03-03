import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { OrderedMap } from "immutable"

const RequestBody = ({
  requestBody,
  getComponent,
  getConfigs,
  specSelectors,
  contentType,
  isExecute,
  specPath,
  onChange
}) => {
  const Markdown = getComponent("Markdown")
  const ModelExample = getComponent("modelExample")
  const RequestBodyEditor = getComponent("RequestBodyEditor")

  const requestBodyDescription = (requestBody && requestBody.get("description")) || null
  const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()
  contentType = contentType || requestBodyContent.keySeq().first()

  const mediaTypeValue = requestBodyContent.get(contentType)

  if(!mediaTypeValue) {
    return null
  }

  return <div>
    { requestBodyDescription &&
      <Markdown source={requestBodyDescription} />
    }
    <ModelExample
      getComponent={ getComponent }
      getConfigs={ getConfigs }
      specSelectors={ specSelectors }
      expandDepth={1}
      isExecute={isExecute}
      schema={mediaTypeValue.get("schema")}
      specPath={specPath.push("content", contentType)}
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
  getConfigs: PropTypes.func.isRequired,
  specSelectors: PropTypes.object.isRequired,
  contentType: PropTypes.string,
  isExecute: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  specPath: PropTypes.array.isRequired
}

export default RequestBody
