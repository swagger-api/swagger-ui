import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import Remarkable from "remarkable"
import { OAS3ComponentWrapFactory } from "../helpers"
import { sanitizer } from "core/components/providers/markdown"
import modifyHtmlElems from "core/plugins/deep-linking/modifyHtmlElems.js"

const parser = new Remarkable("commonmark")

parser.set({ linkTarget: "_blank" })

export const Markdown = ({ source, className = "" }) => {
  if ( source ) {
    const html = parser.render(source)
    const sanitized = sanitizer(html)

    let trimmed

    if(typeof sanitized === "string") {
      trimmed = sanitized.trim()
    }

    let finalHtml

    const hasDeepLinksReady = modifyHtmlElems(trimmed, "a", function(anchor) {
      const isDeepLink = anchor.includes("href=\"#/")
      if (isDeepLink) {
        const removedTrgtBlnk = anchor.replace(" target=\"_blank", "")
        return removedTrgtBlnk
      }
    })

    if (hasDeepLinksReady) {
      finalHtml = hasDeepLinksReady
    }
    else {
      finalHtml = trimmed
    }

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: finalHtml
        }}
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
