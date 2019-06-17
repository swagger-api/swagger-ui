import React from "react"
import PropTypes from "prop-types"

const InfoBasePath = ({ host, basePath }) => (
  <div className="info__baseurl">
    <pre>
      [ Base URL: {host}{basePath} ]
    </pre>
  </div>
)

InfoBasePath.propTypes = {
  host: PropTypes.string,
  basePath: PropTypes.string
}

export default InfoBasePath