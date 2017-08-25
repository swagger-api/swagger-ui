import React from "react"
import PropTypes from "prop-types"

/**
 * ExternalValue is a <HighlightCode> with content set to an external location.
 * usage: <ExternalValue location="http://example.com/path/to/file" />
 */
export default class ExternalValue extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const Markdown = getComponent("Markdown")

    let source = location;

    // TODO

    return (
      <Markdown source={source}/>
    )
  }
}



