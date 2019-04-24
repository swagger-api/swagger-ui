import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { Map, OrderedMap, List } from "immutable"
import { getCommonExtensions, getSampleSchema, stringify } from "core/utils"

const RequestBody = ({
  requestBody,
  requestBodyValue,
  getComponent,
  getConfigs,
  specSelectors,
  fn,
  contentType,
  isExecute,
  specPath,
  onChange
}) => {
  const handleFile = (e) => {
    onChange(e.target.files[0])
  }

  const Markdown = getComponent("Markdown")
  const ModelExample = getComponent("modelExample")
  const RequestBodyEditor = getComponent("RequestBodyEditor")

  const { showCommonExtensions } = getConfigs()

  const requestBodyDescription = (requestBody && requestBody.get("description")) || null
  const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()
  contentType = contentType || requestBodyContent.keySeq().first() || ""

  const mediaTypeValue = requestBodyContent.get(contentType, OrderedMap())
  const schemaForMediaType = mediaTypeValue.get("schema", OrderedMap())

  if(!mediaTypeValue.size) {
    return null
  }

  const isObjectContent = mediaTypeValue.getIn(["schema", "type"]) === "object"

  if(
    contentType === "application/octet-stream"
    || contentType.indexOf("image/") === 0
    || contentType.indexOf("audio/") === 0
    || contentType.indexOf("video/") === 0
  ) {
    const Input = getComponent("Input")

    if(!isExecute) {
      return <i>
        Example values are not available for <code>application/octet-stream</code> media types.
      </i>
    }

    return <Input type={"file"} onChange={handleFile} />
  }

  if (
    isObjectContent &&
    (
      contentType === "application/x-www-form-urlencoded" ||
      contentType.indexOf("multipart/") === 0
    ) &&
    schemaForMediaType.get("properties", OrderedMap()).size > 0
  ) {
    const JsonSchemaForm = getComponent("JsonSchemaForm")
    const ParameterExt = getComponent("ParameterExt")
    const bodyProperties = schemaForMediaType.get("properties", OrderedMap())
    requestBodyValue = Map.isMap(requestBodyValue) ? requestBodyValue : OrderedMap()

    return <div className="table-container">
      { requestBodyDescription &&
        <Markdown source={requestBodyDescription} />
      }
      <table>
        <tbody>
          {
            bodyProperties.map((prop, key) => {
              let commonExt = showCommonExtensions ? getCommonExtensions(prop) : null
              const required = schemaForMediaType.get("required", List()).includes(key)
              const type = prop.get("type")
              const format = prop.get("format")
              const description = prop.get("description")
              const currentValue = requestBodyValue.get(key)
              
              let initialValue = prop.get("default") || prop.get("example") || ""

              if (initialValue === "" && type === "object") {
                initialValue = getSampleSchema(prop, false, {
                  includeWriteOnly: true
                })
              }

              if (typeof initialValue !== "string" && type === "object") {
                initialValue = stringify(initialValue)
              }

              const isFile = type === "string" && (format === "binary" || format === "base64")

              return <tr key={key} className="parameters" data-property-name={key}>
                <td className="col parameters-col_name">
                        <div className={required ? "parameter__name required" : "parameter__name"}>
                          { key }
                          { !required ? null : <span style={{color: "red"}}>&nbsp;*</span> }
                        </div>
                        <div className="parameter__type">
                          { type }
                          { format && <span className="prop-format">(${format})</span>}
                          {!showCommonExtensions || !commonExt.size ? null : commonExt.map((v, key) => <ParameterExt key={`${key}-${v}`} xKey={key} xVal={v} />)}
                        </div>
                        <div className="parameter__deprecated">
                          { prop.get("deprecated") ? "deprecated": null }
                        </div>
                      </td>
                      <td className="col parameters-col_description">
                        <Markdown source={ description }></Markdown>
                        {isExecute ? <div><JsonSchemaForm
                          fn={fn}
                          dispatchInitialValue={!isFile}
                          schema={prop}
                          description={key}
                          getComponent={getComponent}
                          value={currentValue === undefined ? initialValue : currentValue}
                          onChange={(value) => {
                            onChange(value, [key])
                          }}
                        /></div> : null }
                      </td>
                      </tr>
            })
          }
        </tbody>
      </table>
    </div>
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
  requestBodyValue: ImPropTypes.orderedMap.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  contentType: PropTypes.string,
  isExecute: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  specPath: PropTypes.array.isRequired
}

export default RequestBody
