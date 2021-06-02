//OutSystems change - component to render the request URL information
import React, { Component } from "react"

 class RequestUrlOutSystems extends Component {
  static propTypes = {
    parameters: ImPropTypes.list.isRequired,
    host: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    scheme: PropTypes.string.isRequired,
    basePath: PropTypes.string.isRequired,
  }

   //Function to create the requested URL
   getRequestUrl() {
     console.log("heree")
    let { parameters, host, path, scheme, basePath} = this.props
    var requestUrl = path
    var querystring = '';
    for (var i = 0; i < parameters.size; i++) {
      var param = parameters._tail.array[i];
      if (param.get("in") == 'query') {
        if (querystring == '') {
          querystring += '?';
        } else {
          querystring += '&'
        }

        querystring += encodeURIComponent(param.get("name")) + '={' + encodeURIComponent(param.get("name")) + '}';
      }
    }

    var url = scheme + '://' + host
    if (basePath !== '/') {
      url += basePath
    }

    return url + requestUrl + querystring
  }

   render() {
    var requestUrl = this.getRequestUrl()
    return (
      <div >
        <div className="opblock-section-header">
          <h4 className="opblock-title">Request URL</h4>
        </div>
        <div className="parameters-container">
          <div className="request-url">
            <pre className="microlight">{requestUrl}</pre>
          </div>
        </div>
      </div>
      )
  }
 }

export default RequestUrlOutSystems
