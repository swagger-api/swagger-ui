//OutSystems change - component to render the request URL information
import React from "react"

//Function to create the requested URL
const getRequestUrl = (props) => {
  const { parameters, host, path, scheme, basePath } = props;

  const querystring = parameters
    .filter((param) => param.get("in") === 'query')
    .map((param) => encodeURIComponent(param.get("name")) + '={' + encodeURIComponent(param.get("name")) + '}')
    .join("&");

  return `${scheme}://${host}${basePath !== "/" ? basePath : ""}${path}${querystring ? "?" + querystring : ""}`;
};


const RequestUrlOutSystems = (props) => {
  const requestUrl = getRequestUrl(props);
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
};

export default RequestUrlOutSystems;
