import React from "react"
import PropTypes from "prop-types"
import formatXml from "xml-but-prettier"
import toLower from "lodash/toLower"
import { extractFileNameFromContentDispositionHeader } from "core/utils"
import { getKnownSyntaxHighlighterLanguage } from "core/utils/jsonParse"
import win from "core/window"

export default class NrAdditionalOptions extends React.PureComponent {
  state = {
    parsedContent: null
  }

  static propTypes = {
    content: PropTypes.any.isRequired,
    contentType: PropTypes.string,
    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    headers: PropTypes.object,
    url: PropTypes.string
  }

  updateParsedContent = (prevContent) => {
    const { content } = this.props

    if(prevContent === content) {
      return
    }

    if(content && content instanceof Blob) {
      var reader = new FileReader()
      reader.onload = () => {
        this.setState({
          parsedContent: reader.result
        })
      }
      reader.readAsText(content)
    } else {
      this.setState({
        parsedContent: content.toString()
      })
    }
  }

  componentDidMount() {
    this.updateParsedContent(null)
  }

  componentDidUpdate(prevProps) {
    this.updateParsedContent(prevProps.content)
  }

  render() {
    let { content, contentType, url, headers={}, getConfigs, getComponent } = this.props
    const { parsedContent } = this.state
    const HighlightCode = getComponent("highlightCode")
    const NrCsvDownload = getComponent("NrCsvDownload")
    const downloadName = "response_" + new Date().getTime()
    let body, bodyEl
    url = url || ""
    if (/json/i.test(contentType)) {
      // JSON
      let language = null
      let testValueForJson = getKnownSyntaxHighlighterLanguage(content)
      if (testValueForJson) {
        language = "json"
      }
      try {
        body = JSON.stringify(JSON.parse(content), null, "  ")
      } catch (error) {
        body = "can't parse JSON.  Raw result:\n\n" + content
      }

      var jsonRsp = JSON.parse(body)

      bodyEl = <NrCsvDownload data={jsonRsp}/>

    } else {
      // We don't display options for non-json responses
      bodyEl = null
    }

    return ( !bodyEl ? null : <div>
        <h5>Additional options</h5>
        <small>Enter JSON property to download as CSV</small>
        { bodyEl }
      </div>
    )
  }
}
