import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { fromJS, Seq, Iterable } from "immutable"
import { getSampleSchema, fromJSOrdered } from "core/utils"

import ModelExample from "./model-example"

const getExampleComponent = (sampleResponse, examples, HighlightCode) => {
  if (examples && examples.size) {
    return examples.entrySeq().map(([key, example]) => {
      let exampleValue = example
      if (example.toJS) {
        try {
          exampleValue = JSON.stringify(example.toJS(), null, 2)
        }
        catch (e) {
          exampleValue = String(example)
        }
      }

      return (<div key={key}>
        <h5>{key}</h5>
        <HighlightCode className="example code-block" value={exampleValue} />
      </div>)
    }).toArray()
  }

  if (sampleResponse) {
    return <div>
      <HighlightCode className="example code-block" value={sampleResponse} />
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
    fn: PropTypes.object.isRequired,
    contentType: PropTypes.string,
    controlsAcceptHeader: PropTypes.bool,
    onContentTypeChange: PropTypes.func
  }

  static defaultProps = {
    response: fromJS({}),
    onContentTypeChange: () => { }
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
    // const ModelExample = getComponent("modelExample")
    const Markdown = getComponent("Markdown")
    const OperationLink = getComponent("operationLink")
    const ContentType = getComponent("contentType")

    var sampleResponse
    var schema

    if (isOAS3()) {
      let oas3SchemaForContentType = response.getIn(["content", this.state.responseContentType, "schema"])
      sampleResponse = oas3SchemaForContentType ? getSampleSchema(oas3SchemaForContentType.toJS(), this.state.responseContentType, {
        includeReadOnly: true
      }) : null
      schema = oas3SchemaForContentType ? inferSchema(oas3SchemaForContentType.toJS()) : null
    } else {
      schema = inferSchema(response.toJS())
      sampleResponse = schema ? getSampleSchema(schema, contentType, {
        includeReadOnly: true,
        includeWriteOnly: true // writeOnly has no filtering effect in swagger 2.0
      }) : null
    }

    if (examples) {
      examples = examples.map(example => {
        // Remove unwanted properties from examples
        return example.set ? example.set("$$ref", undefined) : example
      })
    }

    let example = getExampleComponent(sampleResponse, examples, HighlightCode)

    return (
      <div className={"response " + (className || "")}>
        <div className="response-col_description">
          <div className="response-item response-code">
            {code} &nbsp;&ndash;&nbsp; <Markdown source={response.get("description")} />
          </div>

          {isOAS3 ?
            <div className={cx("response-content-type", {
              "controls-accept-header": controlsAcceptHeader
            })}>
              <ContentType
                value={this.state.responseContentType}
                contentTypes={response.get("content") ? response.get("content").keySeq() : Seq()}
                onChange={this._onContentTypeChange}
              />
              {controlsAcceptHeader ? <small>Controls <code>Accept</code> header.</small> : null}
            </div>
            : null
          }

          {example ? (
            <div className="response-item">
              <ModelExample
                getComponent={getComponent}
                getConfigs={getConfigs}
                specSelectors={specSelectors}
                schema={fromJSOrdered(schema)}
                example={example} />
            </div>
          ) : null}

          {headers ? (
            <div className="response-item">
              <Headers
                headers={headers}
                getComponent={getComponent}
              />
            </div>
          ) : null}

        </div>
      </div>
    )
  }
}
