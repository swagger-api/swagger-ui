import React from "react"
import PropTypes from "prop-types"
import curlify from "core/curlify"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {SyntaxHighlighter, styles} from "core/syntax-highlighting"

export default class Curl extends React.Component {
  static propTypes = {
    request: PropTypes.object.isRequired
  }

  render() {
    let { request } = this.props
    let curl = curlify(request)

    return (
      <div className="curl-command">
        <h4>Curl</h4>
        <div className="copy-to-clipboard">
            <CopyToClipboard text={curl}><button/></CopyToClipboard>
        </div>
        <div>
          <SyntaxHighlighter language="bash" className="curl microlight" style={styles.agate}>{curl}</SyntaxHighlighter>
        </div>
      </div>
    )
  }

}
