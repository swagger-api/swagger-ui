import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import { fromJS, Iterable, Map } from "immutable"
import { getExtensions, fromJSOrdered, stringify } from "core/utils"
import { getKnownSyntaxHighlighterLanguage } from "core/utils/jsonParse"


const getExampleComponent = ( sampleResponse, HighlightCode ) => {
  if (sampleResponse == null) return null

  const testValueForJson = getKnownSyntaxHighlighterLanguage(sampleResponse)
  const language = testValueForJson ? "json" : null

  return (
    <div>
      <HighlightCode className="example" language={language}>{stringify(sampleResponse)}</HighlightCode>
    </div>
  )
}

export default class Response extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      responseContentType: "",
    }
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    response: PropTypes.instanceOf(Iterable),
    className: PropTypes.string,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object,
    specPath: ImPropTypes.list.isRequired,
    fn: PropTypes.object.isRequired,
    contentType: PropTypes.string,
    activeExamplesKey: PropTypes.string,
    controlsAcceptHeader: PropTypes.bool,
    onContentTypeChange: PropTypes.func
  }

  static defaultProps = {
    response: fromJS({}),
    onContentTypeChange: () => {}
  }

  _onContentTypeChange = (value) => {
    const { onContentTypeChange, controlsAcceptHeader, specSelectors, path, method, code, oas3Actions } = this.props

    if (specSelectors.isOAS3()) {
      oas3Actions.setResponseCodeContentType({ value, path, method, code })
    } else {
      this.setState({ responseContentType: value })
    }

    onContentTypeChange({
      value: value,
      controlsAcceptHeader
    })
  }

  getActiveContentType = () => {
    const { specSelectors, path, method, code, contentType, oas3Selectors } = this.props

    if (specSelectors.isOAS3()) {
      return oas3Selectors?.responseCodeContentType(path, method, code) || contentType || ""
    }

    return this.state.responseContentType || contentType
  }

  getActiveMediaType = () => {
    const { response } = this.props
    const mediaType = response.getIn(["content", this.getActiveContentType()])
    
    return Map.isMap(mediaType) ? mediaType : Map({})
  }

  getTargetExamplesKey = () => {
    const { activeExamplesKey } = this.props

    const examplesForMediaType = this.getActiveMediaType().get("examples", null)

    const firstExamplesKey = Map.isMap(examplesForMediaType)
      ? examplesForMediaType.keySeq().first()
      : undefined
    return activeExamplesKey || firstExamplesKey
  }

  render() {
    let {
      path,
      method,
      code,
      response,
      className,
      specPath,
      fn,
      getComponent,
      getConfigs,
      specSelectors,
      controlsAcceptHeader,
      oas3Actions,
    } = this.props

    let { inferSchema, getSampleSchema } = fn
    let isOAS3 = specSelectors.isOAS3()
    const { showExtensions } = getConfigs()

    let extensions = showExtensions ? getExtensions(response) : null
    let headers = response.get("headers")
    let links = response.get("links")
    const ResponseExtension = getComponent("ResponseExtension")
    const Headers = getComponent("headers")
    const HighlightCode = getComponent("HighlightCode", true)
    const ModelExample = getComponent("modelExample", true)
    const Markdown = getComponent("Markdown", true)
    const OperationLink = getComponent("operationLink")
    const ContentType = getComponent("contentType")
    const ExamplesSelect = getComponent("ExamplesSelect")
    const Example = getComponent("Example")


    var schema, specPathWithPossibleSchema

    const activeContentType = this.getActiveContentType()
    const activeMediaType = this.getActiveMediaType()
    const examplesForMediaType = activeMediaType.get("examples", null)
    // `itemSchema` (OAS 3.2) describes each item of a sequential media type
    const mediaTypeSchemaField = isOAS3 && fn.getMediaTypeSchemaField
      ? fn.getMediaTypeSchemaField(activeMediaType)
      : "schema"
    const isItemSchema = mediaTypeSchemaField === "itemSchema"

    // Goal: find a schema value for `schema`
    if(isOAS3) {
      const oas3SchemaForContentType = activeMediaType.get(mediaTypeSchemaField)
      const hasSchemaForContentType = Map.isMap(oas3SchemaForContentType)

      schema = hasSchemaForContentType ? inferSchema(oas3SchemaForContentType.toJS()) : null
      specPathWithPossibleSchema = hasSchemaForContentType
        ? specPath.push("content", activeContentType, mediaTypeSchemaField)
        : specPath
    } else {
      schema = response.get("schema")
      specPathWithPossibleSchema = response.has("schema") ? specPath.push("schema") : specPath
    }

    let mediaTypeExample
    let shouldOverrideSchemaExample = false
    let sampleSchema
    let sampleGenConfig = {
      includeReadOnly: true
    }

    // Goal: find an example value for `sampleResponse`
    if(isOAS3) {
      const activeMediaTypeSchema = activeMediaType.get(mediaTypeSchemaField)
      sampleSchema = Map.isMap(activeMediaTypeSchema) ? activeMediaTypeSchema.toJS() : undefined
      if(Map.isMap(examplesForMediaType) && !examplesForMediaType.isEmpty()) {
        const targetExamplesKey = this.getTargetExamplesKey()
        const targetExample = examplesForMediaType
          .get(targetExamplesKey, Map({}))
        const getMediaTypeExample = (targetExample) =>
          Map.isMap(targetExample)
          ? targetExample.get("value")
          : undefined
        mediaTypeExample = getMediaTypeExample(targetExample)
        if(mediaTypeExample === undefined) {
          mediaTypeExample = getMediaTypeExample(examplesForMediaType.values().next().value)
        }
        shouldOverrideSchemaExample = true
      } else if(activeMediaType.get("example") !== undefined) {
        // use the example key's value
        mediaTypeExample = activeMediaType.get("example")
        shouldOverrideSchemaExample = true
      }
    } else {
      sampleSchema = schema
      sampleGenConfig = {...sampleGenConfig, includeWriteOnly: true}
      const oldOASMediaTypeExample = response.getIn(["examples", activeContentType])
      if(oldOASMediaTypeExample) {
        mediaTypeExample = oldOASMediaTypeExample
        shouldOverrideSchemaExample = true
      }
    }

    const sampleResponse = getSampleSchema(
      sampleSchema,
      activeContentType,
      sampleGenConfig,
      shouldOverrideSchemaExample ? mediaTypeExample : undefined
    )

    const example = getExampleComponent( sampleResponse, HighlightCode )

    return (
      <tr className={ "response " + ( className || "") } data-code={code}>
        <td className="response-col_status">
          { code }
        </td>
        <td className="response-col_description">

          <div className="response-col_description__inner">
            <Markdown source={ response.get( "description" ) } />
          </div>

          { !showExtensions || !extensions.size ? null : extensions.entrySeq().map(([key, v]) => <ResponseExtension key={`${key}-${v}`} xKey={key} xVal={v} /> )}

          {isOAS3 && Map.isMap(response.get("content")) ? (
            <section className="response-controls">
              <div
                className={cx("response-control-media-type", {
                  "response-control-media-type--accept-controller": controlsAcceptHeader
                })}
              >
                <small className="response-control-media-type__title">
                  Media type
                </small>
                <ContentType
                  value={activeContentType}
                  contentTypes={response.get("content").keySeq()}
                  onChange={this._onContentTypeChange}
                  ariaLabel="Media Type"
                />
                {controlsAcceptHeader ? (
                  <small className="response-control-media-type__accept-message">
                    Controls <code>Accept</code> header.
                  </small>
                ) : null}
              </div>
              {Map.isMap(examplesForMediaType) && !examplesForMediaType.isEmpty() ? (
                <div className="response-control-examples">
                  <small className="response-control-examples__title">
                    Examples
                  </small>
                  <ExamplesSelect
                    examples={examplesForMediaType}
                    currentExampleKey={this.getTargetExamplesKey()}
                    onSelect={(key, { isSyntheticChange } = {}) => {
                      if (isSyntheticChange) return

                      oas3Actions.setActiveExamplesMember({
                        name: key,
                        pathMethod: [path, method],
                        contextType: "responses",
                        contextName: code
                      })
                    }}
                    showLabels={false}
                  />
                </div>
              ) : null}
            </section>
          ) : null}

          { isItemSchema && (example || schema) ? (
            <div className="response-item-schema-note">
              <small>
                Schema of each item in the <code>{ activeContentType }</code> sequence
              </small>
            </div>
          ) : null }

          { example || schema ? (
            <ModelExample
              specPath={specPathWithPossibleSchema}
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              schema={ fromJSOrdered(schema) }
              example={ example }
              includeReadOnly={ true }/>
          ) : null }

          { isOAS3 && Map.isMap(examplesForMediaType) ? (
              <Example
                example={examplesForMediaType.get(this.getTargetExamplesKey(), Map({}))}
                getComponent={getComponent}
                getConfigs={getConfigs}
                omitValue={true}
              />
          ) : null}

          { headers ? (
            <Headers
              headers={ headers }
              getComponent={ getComponent }
            />
          ) : null}

        </td>
        {isOAS3 ? <td className="response-col_links">
          { Map.isMap(links) ?
            links.toSeq().entrySeq().map(([key, link]) => {
              return <OperationLink key={key} name={key} link={ link } getComponent={getComponent}/>
            })
          : <i>No links</i>}
        </td> : null}
      </tr>
    )
  }
}
