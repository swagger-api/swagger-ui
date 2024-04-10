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
  getConfigs,
  syntaxHighlighting = {},
  children = "",
}) => {
  const configs = getConfigs()
  const theme = get(configs, "syntaxHighlight.theme")
  const { styles, defaultStyle } = syntaxHighlighting
  const style = styles?.[theme] ?? defaultStyle

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
  getConfigs: PropTypes.func.isRequired,
  syntaxHighlighting: PropTypes.shape({
    styles: PropTypes.object,
    defaultStyle: PropTypes.object,
  }),
  renderPlainText: PropTypes.func,
  children: PropTypes.string,
}

export default SyntaxHighlighter
