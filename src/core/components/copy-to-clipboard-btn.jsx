import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PropTypes from "prop-types"

/**
 * @param {{ getComponent: func, textToCopy: string }} props
 * @returns {JSX.Element}
 * @constructor
 */
export default class CopyToClipboardBtn extends React.Component {
  constructor(props) {
    super(props)
    this.state = { copied: false }
    this.timerRef = null
  }

  handleCopy = () => {
    this.setState({ copied: true })
    if (this.timerRef) clearTimeout(this.timerRef)
    this.timerRef = setTimeout(() => this.setState({ copied: false }), 1500)
  }

  componentWillUnmount() {
    if (this.timerRef) clearTimeout(this.timerRef)
  }

  render() {
    let { getComponent } = this.props
    const { copied } = this.state

    const CopyIcon = getComponent("CopyIcon")

    return (
      <div className="view-line-link copy-to-clipboard" title="Copy to clipboard">
        <CopyToClipboard text={this.props.textToCopy} onCopy={this.handleCopy}>
          <CopyIcon />
        </CopyToClipboard>
        {copied && <span className="copy-to-clipboard__toast">Copied!</span>}
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    textToCopy: PropTypes.string.isRequired,
  }
}
