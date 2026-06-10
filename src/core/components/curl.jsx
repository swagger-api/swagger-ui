import React from "react"
import PropTypes from "prop-types"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { requestSnippetGenerator_curl_bash } from "../plugins/request-snippets/fn"

export default class Curl extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { copied: false }
    this.timerRef = null
  }

  handleCopy = () => {
    this.setState({ copied: true })
    if (this.timerRef) clearTimeout(this.timerRef)
    this.timerRef = setTimeout(() => this.setState({ copied: false }), 1500)
  }

  componentWillUnmount() {
    if (this.timerRef) clearTimeout(this.timerRef)
  }

  render() {
    const { request, getComponent } = this.props
    const { copied } = this.state
    const curl = requestSnippetGenerator_curl_bash(request)
    const SyntaxHighlighter = getComponent("SyntaxHighlighter", true)

    return (
      <div className="curl-command">
        <h4>Curl</h4>
        <div className="copy-to-clipboard">
            <CopyToClipboard text={curl} onCopy={this.handleCopy}><button/></CopyToClipboard>
            {copied && <span className="copy-to-clipboard__toast">Copied!</span>}
        </div>
        <div>
          <SyntaxHighlighter
            language="bash"
            className="curl microlight"
            renderPlainText={({ children, PlainTextViewer }) => (
              <PlainTextViewer className="curl">{children}</PlainTextViewer>
            )}
          >
            {curl}
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }

}
