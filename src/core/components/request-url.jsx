import React from "react"
import PropTypes from "prop-types"

const RequestUrl = (url) => {
  return <div> <h4>Request URL</h4> <div className="request-url"> <pre>{url.url}</pre> </div> </div>
}

RequestUrl.propTypes = {
  url: PropTypes.String,
}

export default RequestUrl
