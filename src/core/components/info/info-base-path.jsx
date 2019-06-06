import React from "react"
import PropTypes from "prop-types"

export default class InfoBasePath extends React.Component {
  static propTypes = {
    host: PropTypes.string,
    basePath: PropTypes.string
  }

  render() {
    const { host, basePath } = this.props

    return (
      <div className="base-url">
        <pre>
          [ Base URL: {host}{basePath} ]
        </pre>
      </div>
    )
  }
}