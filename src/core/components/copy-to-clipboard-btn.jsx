import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PropTypes from "prop-types"

/**
 * @param {{ textToCopy: string }} props
 * @returns {JSX.Element}
 * @constructor
 */
export default class CopyToClipboardBtn extends React.Component {
  render() {
    return (
      <div className="view-line-link copy-to-clipboard" title="Copy to clipboard">
        <CopyToClipboard text={this.props.textToCopy}>
          <svg width="15" height="16">
            <use href="#copy" xlinkHref="#copy" />
          </svg>
        </CopyToClipboard>
      </div>
    )
  }

  static propTypes = {
    textToCopy: PropTypes.string.isRequired,
  }
}
