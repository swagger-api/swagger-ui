import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PropTypes from "prop-types"

/**
 * @param {{ getComponent: func, textToCopy: string }} props
 * @returns {JSX.Element}
 * @constructor
 */
export default class CopyToClipboardBtn extends React.Component {
  render() {
    let { getComponent } = this.props

    const CopyIcon = getComponent("CopyIcon")

    return (
      <div className="view-line-link copy-to-clipboard" title="Copy to clipboard">
        <CopyToClipboard text={this.props.textToCopy}>
          <CopyIcon />
        </CopyToClipboard>
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    textToCopy: PropTypes.string.isRequired,
  }
}
