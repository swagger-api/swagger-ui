import React from "react"
import PropTypes from "prop-types"
import ReactMarkdown from "react-markdown"
import cx from "classnames"
import { Parser, HtmlRenderer } from "commonmark"
import { OAS3ComponentWrapFactory } from "../helpers"
import { sanitizer } from "core/components/providers/markdown"
import manipHtmlStr from "core/plugins/deep-linking/manipHtmlStr.js"

export const Markdown = ({ source, className = "" }) => {
  if ( source ) {
    const parser = new Parser()
    const writer = new HtmlRenderer()
    const html = writer.render(parser.parse(source || ""))
    var sanitized = sanitizer(html)

    //Create deepLinks
    sanitized = manipHtmlStr(sanitized, "a", function(elem) {
      const href = elem.attributes.href.value
      if (href[0] === "#") {
        elem.removeAttribute("target")
      }
    })

    if ( !source || !html || !sanitized ) {
        return null
    }

    return (
      <ReactMarkdown
        source={sanitized}
        className={cx(className, "renderedMarkdown")}
      />
    )
  }
  return null
}
Markdown.propTypes = {
  source: PropTypes.string,
  className: PropTypes.string,
}

export default OAS3ComponentWrapFactory(Markdown)
