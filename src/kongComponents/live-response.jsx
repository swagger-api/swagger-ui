import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { Iterable } from "immutable"

import Curl from "./curl"
import ResponseBody from "./response-body"

const Headers = ({ headers }) => {
  return (
    <div className="headers">
      <h4>Response headers</h4>
      <div className="response-code">
        <pre>{headers}</pre>
      </div>
    </div>)
}
Headers.propTypes = {
  headers: PropTypes.array.isRequired
}

const Duration = ({ duration }) => {
  return (
    <div>
      <h5>Request duration</h5>
      <pre>{duration} ms</pre>
    </div>
  )
}
Duration.propTypes = {
  duration: PropTypes.number.isRequired
}


export default class LiveResponse extends React.Component {
  static propTypes = {
    response: PropTypes.instanceOf(Iterable).isRequired,
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
    const { showMutatedRequest } = getConfigs()

    const curlRequest = showMutatedRequest ? specSelectors.mutatedRequestFor(path, method) : specSelectors.requestFor(path, method)
    const status = response.get("status")
    const url = response.get("url")
    const headers = response.get("headers").toJS()
    const notDocumented = response.get("notDocumented")
    const isError = response.get("error")
    const body = response.get("text")
    const duration = response.get("duration")
    const headersKeys = Object.keys(headers)
    const contentType = headers["content-type"]

    const returnObject = headersKeys.map(key => {
      return <span className="headerline" key={key}> {key}: {headers[key]} </span>
    })
    const hasHeaders = returnObject.length !== 0

    return (
      <div>
        <h4>Request</h4>
        {curlRequest && <Curl request={curlRequest} />}
        {url && <div>
          <p><small>Request URL</small></p>
          <div className="request-url response-code">
            <pre>{url}</pre>
          </div>
        </div>
        }

        <h4>Server response</h4>
        <div className="response">
          <div className="response-item response-code">
            {status}
            {
              notDocumented ? <div className="response-undocumented">
                &nbsp;&ndash;&nbsp;<i> Undocumented </i>
              </div>
                : null
            }
          </div>

          <div className="response-item">
            {
              isError ? <span>
                {`${response.get("name")}: ${response.get("message")}`}
              </span>
                : null
            }
            {
              body ? <ResponseBody content={body}
                contentType={contentType}
                url={url}
                headers={headers}
                getComponent={getComponent} />
                : null
            }
            {
              hasHeaders ? <Headers headers={returnObject} /> : null
            }
            {
              displayRequestDuration && duration ? <Duration duration={duration} /> : null
            }
          </div>

        </div>
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    response: ImPropTypes.map
  }
}
