import React from "react"
import PropTypes from "prop-types"
import curlify from "core/curlify"
import {copyToClipboard} from "core/copy-to-clipboard"
import {SyntaxHighlighter, styles} from "core/syntax-highlighting"

export default class Curl extends React.Component {
  static propTypes = {
    request: PropTypes.object.isRequired
  }

  copy(curlCommand) {
    return () => copyToClipboard(curlCommand)
  }

  render() {
    let { request } = this.props
    let curl = curlify(request)

    return (
      <div>
        <h4>Curl <i onClick={this.copy(curl)}>(copyCommand)</i></h4>
        <div>
          <SyntaxHighlighter language="bash" className="curl" style={styles.agate}>{curl}</SyntaxHighlighter>
        </div>
      </div>
    )
  }

}
