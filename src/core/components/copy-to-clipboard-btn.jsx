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
    this.handleCopy = this.handleCopy.bind(this)
  }

  handleCopy() {
    this.setState({ copied: true })
    this._timer = setTimeout(() => {
      this.setState({ copied: false })
    }, 2000)
  }

  componentWillUnmount() {
    if (this._timer) {
      clearTimeout(this._timer)
    }
  }

  render() {
    let { getComponent } = this.props
    const { copied } = this.state

    const CopyIcon = getComponent("CopyIcon")

    return (
      <div className="view-line-link copy-to-clipboard" title={copied ? "Copied!" : "Copy to clipboard"}>
        <CopyToClipboard text={this.props.textToCopy} onCopy={this.handleCopy}>
          {copied ? <span className="copy-to-clipboard__copied">Copied!</span> : <CopyIcon />}
        </CopyToClipboard>
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    textToCopy: PropTypes.string.isRequired,
  }
}
