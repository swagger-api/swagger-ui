import React from "react"
import PropTypes from "prop-types"

export default class RequestUrl extends React.Component {
  static propTypes = {
    url: PropTypes.object.isRequired
  }

  render() {
    let { url } = this.props

    return (
      <div>
        <h4>Request URL</h4>
        <div className="request-url">
          <pre>{url}</pre>
        </div>
      </div>
    )
  }

}
