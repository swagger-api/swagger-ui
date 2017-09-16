import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import { defaultStatusCode, getAcceptControllingResponse } from "core/utils"

export default class Responses extends React.Component {

  static propTypes = {
    request: PropTypes.object,
    tryItOutResponse: PropTypes.object,
    responses: PropTypes.object.isRequired,
    produces: PropTypes.object,
    producesValue: PropTypes.any,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired,
    displayRequestDuration: PropTypes.bool.isRequired,
    fn: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  static defaultProps = {
    request: null,
    tryItOutResponse: null,
    produces: fromJS(["application/json"]),
    displayRequestDuration: false
  }

  onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue(this.props.pathMethod, val)

  onResponseContentTypeChange = ({ controlsAcceptHeader, value }) => {
    const { oas3Actions, pathMethod } = this.props
    if(controlsAcceptHeader) {
      oas3Actions.setResponseContentType({
        value,
        pathMethod
      })
    }
  }

  render() {
    let {
      responses,
      request,
      tryItOutResponse,
      getComponent,
      getConfigs,
      specSelectors,
      fn,
      producesValue,
      displayRequestDuration
    } = this.props
    let defaultCode = defaultStatusCode( responses )

    const ContentType = getComponent( "contentType" )
    const LiveResponse = getComponent( "liveResponse" )
    const Response = getComponent( "response" )

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : Responses.defaultProps.produces

    const isSpecOAS3 = specSelectors.isOAS3()

    const acceptControllingResponse = isSpecOAS3 ?
      getAcceptControllingResponse(responses) : null

    return (
      <div className="responses-wrapper">
        <div className="opblock-section-header">
          <h4>Responses</h4>
            { specSelectors.isOAS3() ? null : <label>
              <span>Response content type</span>
              <ContentType value={producesValue}
                         onChange={this.onChangeProducesWrapper}
                         contentTypes={produces}
                         className="execute-content-type"/>
                     </label> }
        </div>
        <div className="responses-inner">
          {
            !tryItOutResponse ? null
                              : <div>
                                  <LiveResponse request={ request }
                                                response={ tryItOutResponse }
                                                getComponent={ getComponent }
                                                getConfigs={ getConfigs }
                                                specSelectors={ specSelectors }
                                                pathMethod={ this.props.pathMethod }
                                                displayRequestDuration={ displayRequestDuration } />
                                  <h4>Responses</h4>
                                </div>

          }

          <table className="responses-table">
            <thead>
              <tr className="responses-header">
                <td className="col col_header response-col_status">Code</td>
                <td className="col col_header response-col_description">Description</td>
                { specSelectors.isOAS3() ? <td className="col col_header response-col_links">Links</td> : null }
              </tr>
            </thead>
            <tbody>
              {
                responses.entrySeq().map( ([code, response]) => {
                  let className = tryItOutResponse && tryItOutResponse.get("status") == code ? "response_current" : ""
                  return (
                    <Response key={ code }
                              isDefault={defaultCode === code}
                              fn={fn}
                              className={ className }
                              code={ code }
                              response={ response }
                              specSelectors={ specSelectors }
                              controlsAcceptHeader={response === acceptControllingResponse}
                              onContentTypeChange={this.onResponseContentTypeChange}
                              contentType={ producesValue }
                              getComponent={ getComponent }/>
                    )
                }).toArray()
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
