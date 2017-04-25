import React, { PropTypes } from "react"
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

export default class LiveResponse extends React.Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    const { request, response, getComponent } = this.props

    const body = response.get("text")
    const status = response.get("status")
    const url = response.get("url")
    const headers = response.get("headers").toJS()
    const notDocumented = response.get("notDocumented")
    const isError = response.get("error")

    const headersKeys = Object.keys(headers)
    const contentType = headers["content-type"]

    const Curl = getComponent("curl")
    const ResponseBody = getComponent("responseBody")
    const returnObject = headersKeys.map(key => {
      return <span className="headerline" key={key}> {key}: {headers[key]} </span>
    })

    return (
      <div>
        { request && <Curl request={ request }/> }
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
                  !notDocumented ? null :
                  <div className="response-undocumented">
                    <i> Undocumented </i>
                  </div>
                }
              </td>
              <td className="col response-col_description">
                {
                  !isError ? null : <span>
                    {`${response.get("name")}: ${response.get("message")}`}
                  </span>
                }
                {
                  !body || isError ? null
                        : <ResponseBody content={ body }
                                        contentType={ contentType }
                                        url={ url }
                                        headers={ headers }
                                        getComponent={ getComponent }/>
                }
                {
                  !headers ? null : <Headers headers={ returnObject }/>
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
