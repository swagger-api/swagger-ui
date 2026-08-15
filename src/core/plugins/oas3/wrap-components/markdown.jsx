import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { Remarkable } from "remarkable"
import { OAS3ComponentWrapFactory } from "../helpers"
import { sanitizer } from "core/components/providers/markdown"

const parser = new Remarkable("commonmark")
parser.block.ruler.enable(["table"])
parser.set({ linkTarget: "_blank" })

export const Markdown = ({ source, className = "", getConfigs = () => ({ useUnsafeMarkdown: false }) }) => {
  if(typeof source !== "string") {
    return null
  }

  if ( source ) {
    const { useUnsafeMarkdown } = getConfigs()
    const html = parser.render(source)

    let trimmed

    if (typeof html === "string")
      trimmed = html.trim()

    const sanitized = sanitizer(trimmed, { useUnsafeMarkdown })

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
  getConfigs: PropTypes.func,
}

export default OAS3ComponentWrapFactory(Markdown)
