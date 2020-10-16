import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { Map, OrderedMap, List } from "immutable"
import { getCommonExtensions, getSampleSchema, stringify, isEmptyValue } from "core/utils"

function getDefaultRequestBodyValue(requestBody, mediaType, activeExamplesKey) {
  let mediaTypeValue = requestBody.getIn(["content", mediaType])
  let schema = mediaTypeValue.get("schema").toJS()
  let example =
    mediaTypeValue.get("example") !== undefined
      ? stringify(mediaTypeValue.get("example"))
      : null
  let currentExamplesValue = mediaTypeValue.getIn([
    "examples",
    activeExamplesKey,
    "value"
  ])

  if (mediaTypeValue.get("examples")) {
    // the media type DOES have examples
    return stringify(currentExamplesValue) || ""
  } else {
    // the media type DOES NOT have examples
    return stringify(
      example ||
        getSampleSchema(schema, mediaType, {
          includeWriteOnly: true
        }) ||
        ""
    )
  }
}



const RequestBody = ({
  requestBody,
  requestBodyValue,
  requestBodyInclusionSetting,
  requestBodyErrors,
  getComponent,
  getConfigs,
  specSelectors,
  fn,
  contentType,
  isExecute,
  specPath,
  onChange,
  onChangeIncludeEmpty,
  activeExamplesKey,
  updateActiveExamplesKey,
}) => {
  const handleFile = (e) => {
    onChange(e.target.files[0])
  }
  const setIsIncludedOptions = (key) => {
    let options = {
      key,
      shouldDispatchInit: false,
      defaultValue: true
    }
    let currentInclusion = requestBodyInclusionSetting.get(key, "no value")
    if (currentInclusion === "no value") {
      options.shouldDispatchInit = true
      // future: can get/set defaultValue from a config setting
    }
    return options
  }

  const Markdown = getComponent("Markdown", true)
  const ModelExample = getComponent("modelExample")
  const RequestBodyEditor = getComponent("RequestBodyEditor")
  const HighlightCode = getComponent("highlightCode")
  const ExamplesSelectValueRetainer = getComponent("ExamplesSelectValueRetainer")
  const Example = getComponent("Example")
  const ParameterIncludeEmpty = getComponent("ParameterIncludeEmpty")

  const { showCommonExtensions } = getConfigs()

  const requestBodyDescription = (requestBody && requestBody.get("description")) || null
  const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()
  contentType = contentType || requestBodyContent.keySeq().first() || ""

  const mediaTypeValue = requestBodyContent.get(contentType, OrderedMap())
  const schemaForMediaType = mediaTypeValue.get("schema", OrderedMap())
  const examplesForMediaType = mediaTypeValue.get("examples", null)

  const handleExamplesSelect = (key /*, { isSyntheticChange } */) => {
    updateActiveExamplesKey(key)
  }
  requestBodyErrors = List.isList(requestBodyErrors) ? requestBodyErrors : List()

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
             Map.isMap(bodyProperties) && bodyProperties.entrySeq().map(([key, prop]) => {
              if (prop.get("readOnly")) return

              let commonExt = showCommonExtensions ? getCommonExtensions(prop) : null
              const required = schemaForMediaType.get("required", List()).includes(key)
              const type = prop.get("type")
              const format = prop.get("format")
              const description = prop.get("description")
              const currentValue = requestBodyValue.getIn([key, "value"])
              const currentErrors = requestBodyValue.getIn([key, "errors"]) || requestBodyErrors

              let initialValue = prop.get("default") || prop.get("example") || ""

              if (initialValue === "") {
                if(type === "object") {
                  initialValue = getSampleSchema(prop, false, {
                    includeWriteOnly: true
                  })
                } else if(type === "array") {
                  initialValue = []
                }
              }

              if (typeof initialValue !== "string" && type === "object") {
                initialValue = stringify(initialValue)
              }

              const isFile = type === "string" && (format === "binary" || format === "base64")

              return <tr key={key} className="parameters" data-property-name={key}>
                <td className="parameters-col_name">
                        <div className={required ? "parameter__name required" : "parameter__name"}>
                          { key }
                          { !required ? null : <span>&nbsp;*</span> }
                        </div>
                        <div className="parameter__type">
                          { type }
                          { format && <span className="prop-format">(${format})</span>}
                          {!showCommonExtensions || !commonExt.size ? null : commonExt.entrySeq().map(([key, v]) => <ParameterExt key={`${key}-${v}`} xKey={key} xVal={v} />)}
                        </div>
                        <div className="parameter__deprecated">
                          { prop.get("deprecated") ? "deprecated": null }
                        </div>
                      </td>
                      <td className="parameters-col_description">
                        <Markdown source={ description }></Markdown>
                        {isExecute ? <div>
                          <JsonSchemaForm
                            fn={fn}
                            dispatchInitialValue={!isFile}
                            schema={prop}
                            description={key}
                            getComponent={getComponent}
                            value={currentValue === undefined ? initialValue : currentValue}
                            required = { required }
                            errors = { currentErrors }
                            onChange={(value) => {
                              onChange(value, [key])
                            }}
                          />
                          {required ? null : (
                            <ParameterIncludeEmpty
                              onChange={(value) => onChangeIncludeEmpty(key, value)}
                              isIncluded={requestBodyInclusionSetting.get(key) || false}
                              isIncludedOptions={setIsIncludedOptions(key)}
                              isDisabled={Array.isArray(currentValue) ? currentValue.length !== 0 : !isEmptyValue(currentValue)}
                            />
                          )}
                        </div> : null }
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
    {
      examplesForMediaType ? (
        <ExamplesSelectValueRetainer
            examples={examplesForMediaType}
            currentKey={activeExamplesKey}
            currentUserInputValue={requestBodyValue}
            onSelect={handleExamplesSelect}
            updateValue={onChange}
            defaultToFirstExample={true}
            getComponent={getComponent}
          />
      ) : null
    }
    {
      isExecute ? (
        <div>
          <RequestBodyEditor
            value={requestBodyValue}
            errors={requestBodyErrors}
            defaultValue={getDefaultRequestBodyValue(
              requestBody,
              contentType,
              activeExamplesKey,
            )}
            onChange={onChange}
            getComponent={getComponent}
          />
        </div>
      ) : (
        <ModelExample
          getComponent={ getComponent }
          getConfigs={ getConfigs }
          specSelectors={ specSelectors }
          expandDepth={1}
          isExecute={isExecute}
          schema={mediaTypeValue.get("schema")}
          specPath={specPath.push("content", contentType)}
          example={
            <HighlightCode
              className="body-param__example"
              getConfigs={getConfigs}
              value={stringify(requestBodyValue) || getDefaultRequestBodyValue(
                requestBody,
                contentType,
                activeExamplesKey,
              )}
            />
          }
          includeWriteOnly={true}
        />
      )
    }
    {
       examplesForMediaType ? (
        <Example
          example={examplesForMediaType.get(activeExamplesKey)}
          getComponent={getComponent}
          getConfigs={getConfigs}
        />
      ) : null
    }
  </div>
}

RequestBody.propTypes = {
  requestBody: ImPropTypes.orderedMap.isRequired,
  requestBodyValue: ImPropTypes.orderedMap.isRequired,
  requestBodyInclusionSetting: ImPropTypes.Map.isRequired,
  requestBodyErrors: ImPropTypes.list.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  contentType: PropTypes.string,
  isExecute: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeIncludeEmpty: PropTypes.func.isRequired,
  specPath: PropTypes.array.isRequired,
  activeExamplesKey: PropTypes.string,
  updateActiveExamplesKey: PropTypes.func,
}

export default RequestBody
