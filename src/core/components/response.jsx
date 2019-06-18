import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import { fromJS, Seq, Iterable, List, Map } from "immutable"
import { getSampleSchema, fromJSOrdered, stringify } from "core/utils"
import ExamplesSelect from "./examples-select"

const getExampleComponent = ( sampleResponse, HighlightCode ) => {
  if ( sampleResponse !== undefined ) { return <div>
      <HighlightCode className="example" value={ sampleResponse } />
    </div>
  }
  return null
}

export default class Response extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      responseContentType: "",
      activeExamplesKey: null,
    }
  }

  static propTypes = {
    code: PropTypes.string.isRequired,
    response: PropTypes.instanceOf(Iterable),
    className: PropTypes.string,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specPath: ImPropTypes.list.isRequired,
    fn: PropTypes.object.isRequired,
    contentType: PropTypes.string,
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
    const { response, contentType } = this.props

    const activeContentType = this.state.responseContentType || contentType
    const activeMediaType = response.getIn(["content", activeContentType], Map({}))
    const examplesForMediaType = activeMediaType.get("examples", null)

    const firstExamplesKey = examplesForMediaType.keySeq().first()
    return this.state.activeExamplesKey || firstExamplesKey
  }

  render() {
    let {
      code,
      response,
      className,
      specPath,
      fn,
      getComponent,
      getConfigs,
      specSelectors,
      contentType,
      controlsAcceptHeader
    } = this.props

    let { inferSchema } = fn
    let { isOAS3 } = specSelectors

    let headers = response.get("headers")
    let links = response.get("links")
    const Headers = getComponent("headers")
    const HighlightCode = getComponent("highlightCode")
    const ModelExample = getComponent("modelExample")
    const Markdown = getComponent( "Markdown" )
    const OperationLink = getComponent("operationLink")
    const ContentType = getComponent("contentType")


    var sampleResponse
    var schema, specPathWithPossibleSchema

    const activeContentType = this.state.responseContentType || contentType
    const activeMediaType = response.getIn(["content", activeContentType], Map({}))
    const examplesForMediaType = activeMediaType.get("examples", null)

    // Goal: find a schema value for `schema`
    if(isOAS3()) {
      const oas3SchemaForContentType = activeMediaType.get("schema", Map({}))

      schema = oas3SchemaForContentType ? inferSchema(oas3SchemaForContentType.toJS()) : null
      specPathWithPossibleSchema = oas3SchemaForContentType ? List(["content", this.state.responseContentType, "schema"]) : specPath
    } else {
      schema = inferSchema(response.toJS()) // TODO: don't convert back and forth. Lets just stick with immutable for inferSchema
      specPathWithPossibleSchema = response.has("schema") ? specPath.push("schema") : specPath
    }

    // Goal: find an example value for `sampleResponse`
    if(isOAS3()) {
      const oas3SchemaForContentType = activeMediaType.get("schema", Map({}))

      if(examplesForMediaType) {
        debugger // eslint-disable-line
        const targetExamplesKey = this.getTargetExamplesKey()
        const targetExample = examplesForMediaType.get(targetExamplesKey)
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
      sampleResponse = schema ? getSampleSchema(schema, activeContentType, {
        includeReadOnly: true,
        includeWriteOnly: true // writeOnly has no filtering effect in swagger 2.0
       }) : null
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

          { isOAS3 ?
            <div className={cx("response-content-type", {
              "controls-accept-header": controlsAcceptHeader
            })}>
              <ContentType
                  value={this.state.responseContentType}
                  contentTypes={ response.get("content") ? response.get("content").keySeq() : Seq() }
                  onChange={this._onContentTypeChange}
                  />
                { controlsAcceptHeader ? <small>Controls <code>Accept</code> header.</small> : null }
            </div>
             : null }

          { isOAS3 && examplesForMediaType ?
            <ExamplesSelect
              examples={examplesForMediaType}
              currentValue={examplesForMediaType.getIn([this.getTargetExamplesKey(), "value"])}
              onSelect={(v, key) => this.setState({ activeExamplesKey: key })}>
            </ExamplesSelect>
          : null}

          { example ? (
            <ModelExample
              specPath={specPathWithPossibleSchema}
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              schema={ fromJSOrdered(schema) }
              example={ example }/>
          ) : null}

          { headers ? (
            <Headers
              headers={ headers }
              getComponent={ getComponent }
            />
          ) : null}


        </td>
        {specSelectors.isOAS3() ? <td className="col response-col_links">
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
