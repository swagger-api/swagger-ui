import React, { Component } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PropTypes from "prop-types"

/**
 * 可点击复制的 operationId 组件
 * 点击 operationId 文本即可复制到剪贴板
 */
export default class ClickableOperationId extends Component {
  constructor(props) {
    super(props)
    this.state = {
      copied: false
    }
  }

  handleCopy = () => {
    this.setState({ copied: true })
    // 2秒后重置状态
    setTimeout(() => {
      this.setState({ copied: false })
    }, 2000)
  }

  render() {
    const { operationId, originalOperationId } = this.props
    const { copied } = this.state
    
    const idToCopy = originalOperationId || operationId
    
    if (!idToCopy) {
      return null
    }

    return (
      <CopyToClipboard text={idToCopy} onCopy={this.handleCopy}>
        <span 
          className={`opblock-summary-operation-id clickable ${copied ? 'copied' : ''}`}
          title={copied ? "Copied!" : "Click to copy operationId"}
        >
          {idToCopy}
          {copied && <span className="copy-feedback"> ✓</span>}
        </span>
      </CopyToClipboard>
    )
  }

  static propTypes = {
    operationId: PropTypes.string,
    originalOperationId: PropTypes.string,
  }
} 