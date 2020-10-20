import React from "react"
import PropTypes from "prop-types"
import curlify from "core/curlify"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {SyntaxHighlighter, getStyle} from "core/syntax-highlighting"
import get from "lodash/get"

export default class Curl extends React.Component {
  static propTypes = {
    getConfigs: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired
  }

  render() {
    let { request, getConfigs } = this.props
    let curl = curlify(request)

    const config = getConfigs()

    const curlBlock = get(config, "syntaxHighlight.activated")
      ? <SyntaxHighlighter
          language="bash"
          className="curl microlight"
          onWheel={this.preventYScrollingBeyondElement}
          style={getStyle(get(config, "syntaxHighlight.theme"))}
          >
          {curl}
        </SyntaxHighlighter>
      :
      <textarea readOnly={true} className="curl" value={curl}></textarea>

    return (
      <div className="curl-command">
        <h4>Curl</h4>
        <div className="copy-to-clipboard">
            <CopyToClipboard text={curl}><button/></CopyToClipboard>
        </div>
        <div>
          {curlBlock}
        </div>
      </div>
    )
  }

}
