import React from "react"
import PropTypes from "prop-types"

const RequestUrl = (url) => {
  return <div className="request-url"><pre>{url.url}</pre></div>
}

RequestUrl.propTypes = {
  url: PropTypes.String,
}

export default RequestUrl
