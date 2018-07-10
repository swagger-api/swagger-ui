import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import Remarkable from "remarkable"
import { OAS3ComponentWrapFactory } from "../helpers"
import { sanitizer } from "core/components/providers/markdown"

const parser = new Remarkable("commonmark")

export const Markdown = ({ source, className = "" }) => {
  if ( source ) {
    const html = parser.render(source)
    const sanitized = sanitizer(html)

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: sanitized
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
