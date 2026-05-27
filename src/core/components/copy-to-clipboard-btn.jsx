import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PropTypes from "prop-types"

const COPY_PATH_LABEL = "Copy path to clipboard"

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
      <div
        className="view-line-link copy-to-clipboard"
        title={COPY_PATH_LABEL}
        aria-label={COPY_PATH_LABEL}
      >
        <CopyToClipboard text={this.props.textToCopy}>
          <button
            aria-label={COPY_PATH_LABEL}
            title={COPY_PATH_LABEL}
            type="button"
          >
            <CopyIcon />
          </button>
        </CopyToClipboard>
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    textToCopy: PropTypes.string.isRequired,
  }
}
