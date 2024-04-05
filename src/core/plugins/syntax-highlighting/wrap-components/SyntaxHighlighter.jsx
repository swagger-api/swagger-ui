/**
 * @prettier
 */
import React from "react"
import get from "lodash/get"

const SyntaxHighlighterWrapper = (Original, system) => (props) => {
  const configs = system.getConfigs()
  const canSyntaxHighlight = !!get(configs, "syntaxHighlight.activated")
  const { renderPlainText, children } = props
  const PlainTextViewer = system.getComponent("PlainTextViewer")

  if (!canSyntaxHighlight && typeof renderPlainText === "function") {
    return renderPlainText({ children, PlainTextViewer })
  }
  if (!canSyntaxHighlight) {
    return <PlainTextViewer>{children}</PlainTextViewer>
  }

  return <Original {...props} />
}

export default SyntaxHighlighterWrapper
