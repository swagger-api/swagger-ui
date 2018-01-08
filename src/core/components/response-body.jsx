import React from "react"
import PropTypes from "prop-types"
import formatXml from "xml-but-prettier"
import lowerCase from "lodash/lowerCase"
import { extractFileNameFromContentDispositionHeader } from "core/utils"

export default class ResponseBody extends React.Component {

  static propTypes = {
    content: PropTypes.any.isRequired,
    contentType: PropTypes.string,
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
      body = formatXml(content, {
        textNodesOnSameLine: true,
        indentor: "  "
      })
      bodyEl = <HighlightCode value={ body } />

      // HTML or Plain Text
    } else if (lowerCase(contentType) === "text/html" || /text\/plain/.test(contentType)) {
      bodyEl = <HighlightCode value={ content } />

      // Image
    } else if (/^image\//i.test(contentType)) {
      if(contentType.includes("svg")) {
        bodyEl = <div> { content } </div>
      } else {
        bodyEl = <img style={{ maxWidth: "100%" }} src={ window.URL.createObjectURL(content) } />
      }

      // Audio
    } else if (/^audio\//i.test(contentType)) {
      bodyEl = <pre><audio controls><source src={ url } type={ contentType } /></audio></pre>

      // Download
    } else if (
      /^application\/octet-stream/i.test(contentType) ||
      (headers["Content-Disposition"] && (/attachment/i).test(headers["Content-Disposition"])) ||
      (headers["content-disposition"] && (/attachment/i).test(headers["content-disposition"])) ||
      (headers["Content-Description"] && (/File Transfer/i).test(headers["Content-Description"])) ||
      (headers["content-description"] && (/File Transfer/i).test(headers["content-description"]))) {

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

      if (!isSafari && "Blob" in window) {
        let type = contentType || "text/html"
        let blob = (content instanceof Blob) ? content : new Blob([content], {type: type})
        let href = window.URL.createObjectURL(blob)
        let fileName = url.substr(url.lastIndexOf("/") + 1)
        let download = [type, fileName, href].join(":")

        // Use filename from response header, 
        // First check if filename is quoted (e.g. contains space), if no, fallback to not quoted check
        let disposition = headers["content-disposition"] || headers["Content-Disposition"]
        if (typeof disposition !== "undefined") {
          let responseFilename = extractFileNameFromContentDispositionHeader(disposition)
          if (responseFilename !== null) {
            download = responseFilename
          }
        }

        bodyEl = <div><a href={ href } download={ download }>{ "Download file" }</a></div>
      } else {
        bodyEl = <pre>Download headers detected but your browser does not support downloading binary via XHR (Blob).</pre>
      }

      // Anything else (CORS)
    } else if (typeof content === "string") {
      bodyEl = <HighlightCode value={ content } />
    } else if ( content.size > 0 ) {
      // We don't know the contentType, but there was some content returned
      bodyEl = <div>Unknown response type</div>
    } else {
      // We don't know the contentType and there was no content returned
      bodyEl = null
    }

    return ( !bodyEl ? null : <div>
        <h5>Response body</h5>
        { bodyEl }
      </div>
    )
  }
}
