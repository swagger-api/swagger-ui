import React from "react"
import PropTypes from "prop-types"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { requestSnippetGenerator_curl_bash } from "../plugins/request-snippets/fn"

const COPY_CURL_COMMAND_LABEL = "Copy cURL command to clipboard"

export default class Curl extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired
  }

  render() {
    const { request, getComponent } = this.props
    const curl = requestSnippetGenerator_curl_bash(request)
    const SyntaxHighlighter = getComponent("SyntaxHighlighter", true)

    return (
      <div className="curl-command">
        <h4>Curl</h4>
        <div
          className="copy-to-clipboard"
          title={COPY_CURL_COMMAND_LABEL}
          aria-label={COPY_CURL_COMMAND_LABEL}
        >
          <CopyToClipboard text={curl}>
            <button
              aria-label={COPY_CURL_COMMAND_LABEL}
              title={COPY_CURL_COMMAND_LABEL}
              type="button"
            />
          </CopyToClipboard>
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
