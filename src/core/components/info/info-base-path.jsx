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
      <pre className="base-url">
        [ Base URL: {host}{basePath} ]
      </pre>
    )
  }
}