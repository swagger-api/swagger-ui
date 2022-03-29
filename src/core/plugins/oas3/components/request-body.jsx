import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { Map, OrderedMap, List } from "immutable"
import { getCommonExtensions, getSampleSchema, stringify, isEmptyValue } from "core/utils"
import { getKnownSyntaxHighlighterLanguage } from "core/utils/jsonParse"

export const getDefaultRequestBodyValue = (requestBody, mediaType, activeExamplesKey) => {
  const mediaTypeValue = requestBody.getIn(["content", mediaType])
  const schema = mediaTypeValue.get("schema").toJS()

  const hasExamplesKey = mediaTypeValue.get("examples") !== undefined
  const exampleSchema = mediaTypeValue.get("example")
  const mediaTypeExample = hasExamplesKey
    ? mediaTypeValue.getIn([
      "examples",
      activeExamplesKey,
      "value"
    ])
    : exampleSchema

  const exampleValue = getSampleSchema(
    schema,
    mediaType,
    {
      includeWriteOnly: true
    },
    mediaTypeExample
  )
  return stringify(exampleValue)
}



const RequestBody = ({
  userHasEditedBody,
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
  setRetainRequestBodyValueFlag
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
  const rawExamplesOfMediaType = mediaTypeValue.get("examples", null)
  const sampleForMediaType = rawExamplesOfMediaType?.map((container, key) => {
    const val = container?.get("value", null)
    if(val) {
      container = container.set("value", getDefaultRequestBodyValue(
        requestBody,
        contentType,
        key,
      ), val)
    }
    return container
  })

  const handleExamplesSelect = (key /*, { isSyntheticChange } */) => {
    updateActiveExamplesKey(key)
  }
  requestBodyErrors = List.isList(requestBodyErrors) ? requestBodyErrors : List()

  if(!mediaTypeValue.size) {
    return null
  }

  const isObjectContent = mediaTypeValue.getIn(["schema", "type"]) === "object"
  const isBinaryFormat = mediaTypeValue.getIn(["schema", "format"]) === "binary"
  const isBase64Format = mediaTypeValue.getIn(["schema", "format"]) === "base64"

  if(
    contentType === "application/octet-stream"
    || contentType.indexOf("image/") === 0
    || contentType.indexOf("audio/") === 0
    || contentType.indexOf("video/") === 0
    || isBinaryFormat
    || isBase64Format
  ) {
    const Input = getComponent("Input")

    if(!isExecute) {
      return <i>
        Example values are not available for <code>{contentType}</code> media types.
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
              const included = requestBodyInclusionSetting.get(key) || false

              const useInitialValFromSchemaSamples = prop.has("default")
                || prop.has("example")
                || prop.hasIn(["items", "example"])
                || prop.hasIn(["items", "default"])
              const useInitialValFromEnum = prop.has("enum") && (prop.get("enum").size === 1 || required)
              const useInitialValue = useInitialValFromSchemaSamples || useInitialValFromEnum

              let initialValue = ""
              if (type === "array" && !useInitialValue) {
                initialValue = []
              }
              if (type === "object" || useInitialValue) {
                // TODO: what about example or examples from requestBody could be passed as exampleOverride
                initialValue = getSampleSchema(prop, false, {
                  includeWriteOnly: true
                })
              }

              if (typeof initialValue !== "string" && type === "object") {
               initialValue = stringify(initialValue)
              }
              if (typeof initialValue === "string" && type === "array") {
                initialValue = JSON.parse(initialValue)
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
                      isIncluded={included}
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

  const sampleRequestBody = getDefaultRequestBodyValue(
    requestBody,
    contentType,
    activeExamplesKey,
  )
  let language = null
  let testValueForJson = getKnownSyntaxHighlighterLanguage(sampleRequestBody)
  if (testValueForJson) {
    language = "json"
  }

  return <div>
    { requestBodyDescription &&
      <Markdown source={requestBodyDescription} />
    }
    {
      sampleForMediaType ? (
        <ExamplesSelectValueRetainer
            userHasEditedBody={userHasEditedBody}
            examples={sampleForMediaType}
            currentKey={activeExamplesKey}
            currentUserInputValue={requestBodyValue}
            onSelect={handleExamplesSelect}
            updateValue={onChange}
            defaultToFirstExample={true}
            getComponent={getComponent}
            setRetainRequestBodyValueFlag={setRetainRequestBodyValueFlag}
          />
      ) : null
    }
    {
      isExecute ? (
        <div>
          <RequestBodyEditor
            value={requestBodyValue}
            errors={requestBodyErrors}
            defaultValue={sampleRequestBody}
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
              language={language}
              value={stringify(requestBodyValue) || sampleRequestBody}
            />
          }
          includeWriteOnly={true}
        />
      )
    }
    {
      sampleForMediaType ? (
        <Example
          example={sampleForMediaType.get(activeExamplesKey)}
          getComponent={getComponent}
          getConfigs={getConfigs}
        />
      ) : null
    }
  </div>
}

RequestBody.propTypes = {
  userHasEditedBody: PropTypes.bool.isRequired,
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
  setRetainRequestBodyValueFlag: PropTypes.func,
  oas3Actions: PropTypes.object.isRequired
}

export default RequestBody
