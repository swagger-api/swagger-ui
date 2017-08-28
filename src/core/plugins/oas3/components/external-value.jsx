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
    let { location } = this.props
    // const Markdown = getComponent("Markdown")

    // TODO should externalValue be fetched and displayed inline?

    return (
      <div>
        <a href={location} target="_blank" title={location} >Open ExternalValue</a>
      </div>
    )
  }
}



