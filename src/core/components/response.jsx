import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import { fromJS, Seq, Iterable, List, Map } from "immutable"
import { getSampleSchema, fromJSOrdered, stringify } from "core/utils"

const getExampleComponent = ( sampleResponse, HighlightCode ) => {
  if (
    sampleResponse !== undefined &&
    sampleResponse !== null
  ) { return <div>
      <HighlightCode className="example" value={ stringify(sampleResponse) } />
    </div>
  }
  return null
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
  };

  _onContentTypeChange = (value) => {
    const { onContentTypeChange, controlsAcceptHeader } = this.props
    this.setState({ responseContentType: value })
    onContentTypeChange({
      value: value,
      controlsAcceptHeader
    })
  }

  getTargetExamplesKey = () => {
    const { response, contentType, activeExamplesKey } = this.props

    const activeContentType = this.state.responseContentType || contentType
    const activeMediaType = response.getIn(["content", activeContentType], Map({}))
    const examplesForMediaType = activeMediaType.get("examples", null)

    const firstExamplesKey = examplesForMediaType.keySeq().first()
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
      contentType,
      controlsAcceptHeader,
      oas3Actions,
    } = this.props

    let { inferSchema } = fn
    let isOAS3 = specSelectors.isOAS3()

    let headers = response.get("headers")
    let links = response.get("links")
    const Headers = getComponent("headers")
    const HighlightCode = getComponent("highlightCode")
    const ModelExample = getComponent("modelExample")
    const Markdown = getComponent( "Markdown" )
    const OperationLink = getComponent("operationLink")
    const ContentType = getComponent("contentType")
    const ExamplesSelect = getComponent("ExamplesSelect")
    const Example = getComponent("Example")


    var sampleResponse
    var schema, specPathWithPossibleSchema

    const activeContentType = this.state.responseContentType || contentType
    const activeMediaType = response.getIn(["content", activeContentType], Map({}))
    const examplesForMediaType = activeMediaType.get("examples", null)

    // Goal: find a schema value for `schema`
    if(isOAS3) {
      const oas3SchemaForContentType = activeMediaType.get("schema")

      schema = oas3SchemaForContentType ? inferSchema(oas3SchemaForContentType.toJS()) : null
      specPathWithPossibleSchema = oas3SchemaForContentType ? List(["content", this.state.responseContentType, "schema"]) : specPath
    } else {
      schema = response.get("schema")
      specPathWithPossibleSchema = response.has("schema") ? specPath.push("schema") : specPath
    }

    // Goal: find an example value for `sampleResponse`
    if(isOAS3) {
      const oas3SchemaForContentType = activeMediaType.get("schema", Map({}))

      if(examplesForMediaType) {
        const targetExamplesKey = this.getTargetExamplesKey()
        const targetExample = examplesForMediaType.get(targetExamplesKey, Map({}))
        sampleResponse = stringify(targetExample.get("value"))
      } else if(activeMediaType.get("example") !== undefined) {
        // use the example key's value
        sampleResponse = stringify(activeMediaType.get("example"))
      } else {
        // use an example value generated based on the schema
        sampleResponse = getSampleSchema(oas3SchemaForContentType.toJS(), this.state.responseContentType, {
          includeReadOnly: true
        })
      }
    } else {
      if(response.getIn(["examples", activeContentType])) {
        sampleResponse = response.getIn(["examples", activeContentType])
      } else {
        sampleResponse = schema ? getSampleSchema(
          schema.toJS(), 
          activeContentType, 
          {
            includeReadOnly: true,
            includeWriteOnly: true // writeOnly has no filtering effect in swagger 2.0
          }
        ) : null
      }
    }

    let example = getExampleComponent( sampleResponse, HighlightCode )

    return (
      <tr className={ "response " + ( className || "") } data-code={code}>
        <td className="col response-col_status">
          { code }
        </td>
        <td className="col response-col_description">

          <div className="response-col_description__inner">
            <Markdown source={ response.get( "description" ) } />
          </div>

          {isOAS3 && response.get("content") ? (
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
                  value={this.state.responseContentType}
                  contentTypes={
                    response.get("content")
                      ? response.get("content").keySeq()
                      : Seq()
                  }
                  onChange={this._onContentTypeChange}
                />
                {controlsAcceptHeader ? (
                  <small className="response-control-media-type__accept-message">
                    Controls <code>Accept</code> header.
                  </small>
                ) : null}
              </div>
              {examplesForMediaType ? (
                <div className="response-control-examples">
                  <small className="response-control-examples__title">
                    Examples
                  </small>
                  <ExamplesSelect
                    examples={examplesForMediaType}
                    currentExampleKey={this.getTargetExamplesKey()}
                    onSelect={key =>
                      oas3Actions.setActiveExamplesMember({
                        name: key,
                        pathMethod: [path, method],
                        contextType: "responses",
                        contextName: code
                      })
                    }
                    showLabels={false}
                  />
                </div>
              ) : null}
            </section>
          ) : null}

          { example || schema ? (
            <ModelExample
              specPath={specPathWithPossibleSchema}
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              schema={ fromJSOrdered(schema) }
              example={ example }/>
          ) : null }

          { isOAS3 && examplesForMediaType ? (
              <Example
                example={examplesForMediaType.get(this.getTargetExamplesKey(), Map({}))}
                getComponent={getComponent}
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
        {isOAS3 ? <td className="col response-col_links">
          { links ?
            links.toSeq().map((link, key) => {
              return <OperationLink key={key} name={key} link={ link } getComponent={getComponent}/>
            })
          : <i>No links</i>}
        </td> : null}
      </tr>
    )
  }
}
