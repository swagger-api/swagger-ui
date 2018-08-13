import React from "react"
import PropTypes from "prop-types"
import { fromJS, Iterable } from "immutable"
import { defaultStatusCode, getAcceptControllingResponse } from "core/utils"
import { CodeSnippetWidget } from 'react-apiembed'

import Response from "./response"
import LiveResponse from "./live-response"

export default class Responses extends React.Component {
  static propTypes = {
    tryItOutResponse: PropTypes.instanceOf(Iterable),
    responses: PropTypes.instanceOf(Iterable).isRequired,
    produces: PropTypes.instanceOf(Iterable),
    producesValue: PropTypes.any,
    displayRequestDuration: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    har: PropTypes.object
  }

  static defaultProps = {
    tryItOutResponse: null,
    produces: fromJS(["application/json"]),
    displayRequestDuration: false
  }

  shouldComponentUpdate (nextProps) {
    // BUG: props.tryItOutResponse is always coming back as a new Immutable instance
    let render = this.props.tryItOutResponse !== nextProps.tryItOutResponse
      || this.props.responses !== nextProps.responses
      || this.props.produces !== nextProps.produces
      || this.props.producesValue !== nextProps.producesValue
      || this.props.displayRequestDuration !== nextProps.displayRequestDuration
      || this.props.path !== nextProps.path
      || this.props.method !== nextProps.method
    return render
  }

  onChangeProducesWrapper = (val) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  onResponseContentTypeChange = ({ controlsAcceptHeader, value }) => {
    const { oas3Actions, path, method } = this.props
    if (controlsAcceptHeader) {
      oas3Actions.setResponseContentType({
        value,
        path,
        method
      })
    }
  }

  render () {
    let {
      responses,
      tryItOutResponse,
      getComponent,
      getConfigs,
      specSelectors,
      fn,
      har,
      producesValue,
      displayRequestDuration
    } = this.props

    let defaultCode = defaultStatusCode(responses)

    const ContentType = getComponent("contentType")
    // const LiveResponse = getComponent("liveResponse")
    // const Response = getComponent( "response" )

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : Responses.defaultProps.produces

    const isSpecOAS3 = specSelectors.isOAS3()

    const acceptControllingResponse = isSpecOAS3 ?
      getAcceptControllingResponse(responses) : null
    const snippets = getConfigs().kong.languages
      return (
      <div className="responses-wrapper">
        {
          !tryItOutResponse ? null :
            <div>
              <LiveResponse response={tryItOutResponse}
                getComponent={getComponent}
                getConfigs={getConfigs}
                specSelectors={specSelectors}
                path={this.props.path}
                method={this.props.method}
                displayRequestDuration={displayRequestDuration} />
            </div>

        }
        {isSpecOAS3 ? null :
          <div className="opblock-section-header light">
            <h4>Example Request</h4>
          </div>
        }
        {isSpecOAS3 ? null :
          <CodeSnippetWidget har={har} snippets={snippets} />
        }
        <div className="opblock-section-header light">
          <h4>Responses</h4>
          {specSelectors.isOAS3() ? null :
            <ContentType value={producesValue}
              onChange={this.onChangeProducesWrapper}
              contentTypes={produces}
              className="execute-content-type" />
          }
        </div>
        <div className="responses-inner">
          <div className="responses-table">
            {
              responses.entrySeq().map(([code, response]) => {
                let className = tryItOutResponse && tryItOutResponse.get("status") == code ? "response_current" : ""
                return (
                  <Response key={code}
                    isDefault={defaultCode === code}
                    fn={fn}
                    className={className}
                    code={code}
                    response={response}
                    specSelectors={specSelectors}
                    controlsAcceptHeader={response === acceptControllingResponse}
                    onContentTypeChange={this.onResponseContentTypeChange}
                    contentType={producesValue}
                    getConfigs={getConfigs}
                    getComponent={getComponent} />
                )
              }).toArray()
            }
          </div>
        </div>
      </div>
    )
  }
}
