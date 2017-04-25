import React, { PropTypes } from "react"
import { formatXml } from "core/utils"
import lowerCase from "lodash/lowerCase"

export default class ResponseBody extends React.Component {

  static propTypes = {
    content: PropTypes.any.isRequired,
    contentType: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
    headers: PropTypes.object,
    url: PropTypes.string
  }

  render() {
    let { content, contentType, url, headers={}, getComponent } = this.props
    const HighlightCode = getComponent("highlightCode")
    let body, bodyEl
    url = url || ""

    // JSON
    if (/json/i.test(contentType)) {
      try {
        body = JSON.stringify(JSON.parse(content), null, "  ")
      } catch (error) {
        body = "can't parse JSON.  Raw result:\n\n" + content
      }

      bodyEl = <HighlightCode value={ body } />

      // XML
    } else if (/xml/i.test(contentType)) {
      body = formatXml(content)
      bodyEl = <HighlightCode value={ body } />

      // HTML or Plain Text
    } else if (lowerCase(contentType) === "text/html" || /text\/plain/.test(contentType)) {
      bodyEl = <HighlightCode value={ content } />

      // Image
    } else if (/^image\//i.test(contentType)) {
      bodyEl = <img src={ url } />

      // Audio
    } else if (/^audio\//i.test(contentType)) {
      bodyEl = <pre><audio controls><source src={ url } type={ contentType } /></audio></pre>

      // Download
    } else if (
      /^application\/octet-stream/i.test(contentType) ||
      headers["Content-Disposition"] && (/attachment/i).test(headers["Content-Disposition"]) ||
      headers["content-disposition"] && (/attachment/i).test(headers["content-disposition"]) ||
      headers["Content-Description"] && (/File Transfer/i).test(headers["Content-Description"]) ||
      headers["content-description"] && (/File Transfer/i).test(headers["content-description"])) {

      let contentLength = headers["content-length"] || headers["Content-Length"]
      if ( !(+contentLength) ) return null

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

      if (!isSafari && "Blob" in window) {
        let type = contentType || "text/html"
        let blob = (content instanceof Blob) ? content : new Blob([content], {type: type})
        let href = window.URL.createObjectURL(blob)
        let fileName = url.substr(url.lastIndexOf("/") + 1)
        let download = [type, fileName, href].join(":")

        // Use filename from response header
        let disposition = headers["content-disposition"] || headers["Content-Disposition"]
        if (typeof disposition !== "undefined") {
          let responseFilename = /filename=([^;]*);?/i.exec(disposition)
          if (responseFilename !== null && responseFilename.length > 1) {
            download = responseFilename[1]
          }
        }

        bodyEl = <div><a href={ href } download={ download }>{ "Download file" }</a></div>
      } else {
        bodyEl = <pre>Download headers detected but your browser does not support downloading binary via XHR (Blob).</pre>
      }

      // Anything else (CORS)
    } else if (typeof content === "string") {
      bodyEl = <HighlightCode value={ content } />
    } else {
      bodyEl = <div>Unknown response type</div>
    }

    return ( !bodyEl ? null : <div>
        <h5>Response body</h5>
        { bodyEl }
      </div>
    )
  }
}
