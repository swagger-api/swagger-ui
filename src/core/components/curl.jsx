import React from "react"
import PropTypes from "prop-types"
import curlify from "core/curlify"

export default class Curl extends React.Component {
  static propTypes = {
    request: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  }

  handleFocus(e) {
    e.target.select()
    document.execCommand("copy")
  }

  render() {
    let { request, title } = this.props
    let curl = curlify(request)

    return (
      <div>
        <h4>{title}</h4>
        <div className="copy-paste">
          <textarea onFocus={this.handleFocus} readOnly="true" className="curl" style={{ whiteSpace: "normal" }} value={curl}></textarea>
        </div>
      </div>
    )
  }

}
