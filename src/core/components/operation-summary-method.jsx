import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable } from "immutable"
import { OPERATION_METHODS } from "core/utils/operation-methods"

export default class OperationSummaryMethod extends PureComponent {

  static propTypes = {
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    method: PropTypes.string.isRequired,
  }

  static defaultProps = {
    operationProps: null,
  }
  render() {

    let {
      method,
    } = this.props

    return (
      <span className="opblock-summary-method">{OPERATION_METHODS.includes(method) ? method.toUpperCase() : method}</span>
    )
  }
}
