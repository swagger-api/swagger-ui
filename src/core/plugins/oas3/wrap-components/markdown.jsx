import React from "react"
import PropTypes from "prop-types"
import DOMPurify from "dompurify"

export default (Original, system) => (props) => {
  const { getComponent, getStore } = system
  const { fn } = getStore().getState()
  const { source, className = "", getConfigs = () => ({}) } = props
  const configs = getConfigs()

  if (typeof source !== "string") {
    return null
  }

  if (source === "") {
    return null
  }

  const MarkdownComponent = getComponent("Markdown", true)
  const NewlineComponent = getComponent("Newline", true)

  const html = fn.getMarkdownParser()(source || "")
  const sanitizedHtml = DOMPurify.sanitize(html)

  if (typeof html === "string") {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    )
  }

  return (
    <div className={className}>
      <MarkdownComponent source={source} />
      <NewlineComponent />
    </div>
  )
}
