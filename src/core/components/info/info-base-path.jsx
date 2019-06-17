import React from "react"
import PropTypes from "prop-types"

const InfoBasePath = ({ host, basePath }) => (
  <div className="base-url">
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