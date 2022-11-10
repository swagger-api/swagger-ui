import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable } from "immutable"

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
      <span className="opblock-summary-method">{method.toUpperCase()}</span>
    )
  }
}
