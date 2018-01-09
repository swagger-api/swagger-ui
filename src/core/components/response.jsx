import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import { fromJS, OrderedMap, Seq, Iterable, List } from "immutable"
import { getSampleSchema, fromJSOrdered } from "core/utils"

const getExampleComponent = ( sampleResponse, examples, HighlightCode ) => {
  if ( examples && examples.size ) {
    return examples.entrySeq().map( ([ key, example ]) => {
      let exampleValue = example
      if ( example.toJS ) {
        try {
          exampleValue = JSON.stringify(example.toJS(), null, 2)
        }
        catch(e) {
          exampleValue = String(example)
        }
      }

      return (<div key={ key }>
        <h5>{ key }</h5>
        <HighlightCode className="example" value={ exampleValue } />
      </div>)
    }).toArray()
  }

  if ( sampleResponse ) { return <div>
      <HighlightCode className="example" value={ sampleResponse } />
    </div>
  }
  return null
}

export default class Response extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      responseContentType: ""
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
    let examples = response.get("examples")
    let links = response.get("links")
    const Headers = getComponent("headers")
    const HighlightCode = getComponent("highlightCode")
    const ModelExample = getComponent("modelExample")
    const Markdown = getComponent( "Markdown" )
    const OperationLink = getComponent("operationLink")
    const ContentType = getComponent("contentType")

    var sampleResponse
    var schema, specPathWithPossibleSchema

    if(isOAS3()) {
      const schemaPath = List(["content", this.state.responseContentType, "schema"])
      const oas3SchemaForContentType = response.getIn(schemaPath)
      sampleResponse = oas3SchemaForContentType ? getSampleSchema(oas3SchemaForContentType.toJS(), this.state.responseContentType, {
        includeReadOnly: true
      }) : null
      schema = oas3SchemaForContentType ? inferSchema(oas3SchemaForContentType.toJS()) : null
      examples = response.getIn(["content", this.state.responseContentType, "examples"])

      if(!examples) {
        // The example object is mutually exclusive of the examples object. Prefer `examples` here.
        let example = response.getIn(["content", this.state.responseContentType, "example"])

        if(example) {
          examples = OrderedMap({"Example": example})
        }
      }

      specPathWithPossibleSchema = oas3SchemaForContentType ? schemaPath : specPath
    } else {
      schema = inferSchema(response.toJS()) // TODO: don't convert back and forth. Lets just stick with immutable for inferSchema
      specPathWithPossibleSchema = response.has("schema") ? specPath.push("schema") : specPath
      sampleResponse = schema ? getSampleSchema(schema, contentType, {
        includeReadOnly: true,
        includeWriteOnly: true // writeOnly has no filtering effect in swagger 2.0
       }) : null
    }

    if(examples) {
      examples = examples.map(example => {
        // Remove unwanted properties from examples
        return example.set ? example.set("$$ref", undefined) : example
      })
    }

    let example = getExampleComponent( sampleResponse, examples, HighlightCode )

    return (
      <tr className={ "response " + ( className || "") }>
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

          { example ? (
            <ModelExample
              specPath={specPathWithPossibleSchema}
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              schema={ fromJSOrdered(schema) }
              example={ example }
              examples={ examples }
            />
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
