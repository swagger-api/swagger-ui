import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const Headers = ( { headers } )=>{
  return (
    <div>
      <h5>Response headers</h5>
      <pre>{headers}</pre>
    </div>)
}
Headers.propTypes = {
  headers: PropTypes.array.isRequired
}

const Duration = ( { duration } ) => {
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
    response: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    pathMethod: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    displayRequestDuration: PropTypes.bool.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  render() {
    const { response, getComponent, getConfigs, displayRequestDuration, specSelectors, pathMethod } = this.props
    const { showMutatedRequest } = getConfigs()

    const curlRequest = showMutatedRequest ? specSelectors.mutatedRequestFor(pathMethod[0], pathMethod[1]) : specSelectors.requestFor(pathMethod[0], pathMethod[1])
    const status = response.get("status")
    const url = response.get("url")
    const headers = response.get("headers").toJS()
    const notDocumented = response.get("notDocumented")
    const isError = response.get("error")
    const body = response.get("text")
    const duration = response.get("duration")
    const headersKeys = Object.keys(headers)
    const contentType = headers["content-type"]

    const Curl = getComponent("curl")
    const ResponseBody = getComponent("responseBody")
    const returnObject = headersKeys.map(key => {
      return <span className="headerline" key={key}> {key}: {headers[key]} </span>
    })
    const hasHeaders = returnObject.length !== 0

    return (
      <div>
        { curlRequest && <Curl request={ curlRequest }/> }
        <h4>Server response</h4>
        <table className="responses-table">
          <thead>
          <tr className="responses-header">
            <td className="col col_header response-col_status">Code</td>
            <td className="col col_header response-col_description">Details</td>
          </tr>
          </thead>
          <tbody>
            <tr className="response">
              <td className="col response-col_status">
                { status }
                {
                  notDocumented ? <div className="response-undocumented">
                                    <i> Undocumented </i>
                                  </div>
                                : null
                }
              </td>
              <td className="col response-col_description">
                {
                  isError ? <span>
                              {`${response.get("name")}: ${response.get("message")}`}
                            </span>
                          : null
                }
                {
                  body ? <ResponseBody content={ body }
                                       contentType={ contentType }
                                       url={ url }
                                       headers={ headers }
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

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    request: ImPropTypes.map,
    response: ImPropTypes.map
  }
}
