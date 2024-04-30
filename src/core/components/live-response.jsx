import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const Headers = ( { headers } )=>{
  return (
    <div>
      <h5>Response headers</h5>
      <pre className="microlight">{headers}</pre>
    </div>)
}
Headers.propTypes = {
  headers: PropTypes.array.isRequired
}

const Duration = ( { duration } ) => {
  return (
    <div>
      <h5>Request duration</h5>
      <pre className="microlight">{duration} ms</pre>
    </div>
  )
}
Duration.propTypes = {
  duration: PropTypes.number.isRequired
}


export default class LiveResponse extends React.Component {
  static propTypes = {
    response: ImPropTypes.map,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    displayRequestDuration: PropTypes.bool.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    // BUG: props.response is always coming back as a new Immutable instance
    // same issue as responses.jsx (tryItOutResponse)
    return this.props.response !== nextProps.response
      || this.props.path !== nextProps.path
      || this.props.method !== nextProps.method
      || this.props.displayRequestDuration !== nextProps.displayRequestDuration
  }

  render() {
    const { response, getComponent, getConfigs, displayRequestDuration, specSelectors, path, method } = this.props
    const { showMutatedRequest, requestSnippetsEnabled } = getConfigs()

    const curlRequest = showMutatedRequest ? specSelectors.mutatedRequestFor(path, method) : specSelectors.requestFor(path, method)
    const status = response.get("status")
    const url = curlRequest.get("url")
    const headers = response.get("headers").toJS()
    const notDocumented = response.get("notDocumented")
    const isError = response.get("error")
    const body = response.get("text")
    const duration = response.get("duration")
    const headersKeys = Object.keys(headers)
    const contentType = headers["content-type"] || headers["Content-Type"]

    const ResponseBody = getComponent("responseBody")
    const returnObject = headersKeys.map(key => {
      var joinedHeaders = Array.isArray(headers[key]) ? headers[key].join() : headers[key]
      return <span className="headerline" key={key}> {key}: {joinedHeaders} </span>
    })
    const hasHeaders = returnObject.length !== 0
    const Markdown = getComponent("Markdown", true)
    const RequestSnippets = getComponent("RequestSnippets", true)
    const Curl = getComponent("curl", true)

    return (
      <div>
        { curlRequest && requestSnippetsEnabled 
          ? <RequestSnippets request={ curlRequest }/>
          : <Curl request={ curlRequest } />
        }
        { url && <div>
            <div className="request-url">
              <h4>Request URL</h4>
              <pre className="microlight">{url}</pre>
            </div>
          </div>
        }
        <h4>Server response</h4>
        <table className="responses-table live-responses-table">
          <thead>
          <tr className="responses-header">
            <td className="col_header response-col_status">Code</td>
            <td className="col_header response-col_description">Details</td>
          </tr>
          </thead>
          <tbody>
            <tr className="response">
              <td className="response-col_status">
                { status }
                {
                  notDocumented ? <div className="response-undocumented">
                                    <i> Undocumented </i>
                                  </div>
                                : null
                }
              </td>
              <td className="response-col_description">
                {
                  isError ? <Markdown source={`${response.get("name") !== "" ? `${response.get("name")}: ` : ""}${response.get("message")}`}/>
                          : null
                }
                {
                  body ? <ResponseBody content={ body }
                                       contentType={ contentType }
                                       url={ url }
                                       headers={ headers }
                                       getConfigs={ getConfigs }
                                       getComponent={ getComponent }/>
                       : null
                }
                {
                  hasHeaders ? <Headers headers={ returnObject }/> : null
                }
                {
                  displayRequestDuration && duration ? <Duration duration={ duration } /> : null
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
