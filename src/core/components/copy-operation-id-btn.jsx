import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PropTypes from "prop-types"

/**
 * 专门用于复制 operationId 的按钮组件
 * @param {{ getComponent: func, operationId: string, title?: string }} props
 * @returns {JSX.Element}
 * @constructor
 */
export default class CopyOperationIdBtn extends React.Component {
  render() {
    let { getComponent, operationId, title = "Copy operationId to clipboard" } = this.props

    if (!operationId) {
      return null
    }

    const CopyIcon = getComponent("CopyIcon")

    return (
      <div className="view-line-link copy-to-clipboard copy-operation-id" title={title}>
        <CopyToClipboard text={operationId}>
          <CopyIcon />
        </CopyToClipboard>
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    operationId: PropTypes.string,
    title: PropTypes.string,
  }
} 