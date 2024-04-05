/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import ReactSyntaxHighlighter from "react-syntax-highlighter/dist/esm/light"
import get from "lodash/get"

const SyntaxHighlighter = ({
  language,
  className = "",
  getSystem,
  children = null,
}) => {
  const system = getSystem()
  const configs = system.getConfigs()
  const theme = get(configs, "syntaxHighlight.theme")
  const { styles, defaultStyle } = system.syntaxHighlighting
  const style = styles[theme] ?? defaultStyle

  return (
    <ReactSyntaxHighlighter
      language={language}
      className={className}
      style={style}
    >
      {children}
    </ReactSyntaxHighlighter>
  )
}

SyntaxHighlighter.propTypes = {
  language: PropTypes.string.isRequired,
  className: PropTypes.string,
  getSystem: PropTypes.func.isRequired,
  children: PropTypes.node,
}

export default SyntaxHighlighter
