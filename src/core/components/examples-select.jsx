/**
 * @prettier
 */

import React from "react"
import Im from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class ExamplesSelect extends React.PureComponent {
  static propTypes = {
    examples: ImPropTypes.map.isRequired,
    onSelect: PropTypes.func,
    currentValue: PropTypes.any.isRequired,
    selectMessage: PropTypes.string,
  }

  static defaultProps = {
    examples: Im.Map({}),
    onSelect: (...args) =>
      console.log(
        // FIXME: remove before merging to master...
        `DEBUG: ExamplesSelect was not given an onSelect callback`,
        ...args
      ),
    currentValue: null,
    selectMessage: "Select an example...",
  }

  _onSelectChange = e => {
    debugger // eslint-disable-line
    if (typeof this.props.onSelect === "function") {
      const element = e.target.selectedOptions[0]
      const key = element.getAttribute("data-key")
      const value = this.props.examples.getIn([key, "value"])
      this.props.onSelect(value && value.toJS ? value.toJS() : value, key)
    }
  }

  render() {
    const { examples, currentValue, selectMessage } = this.props

    const isCurrentValueAnExampleValue = examples.some(
      example => example.get("value") === currentValue
    )

    debugger //eslint-disable-line

    return (
      <select onChange={this._onSelectChange} value={currentValue}>
        {!isCurrentValueAnExampleValue ? (
          <option selected>{selectMessage}</option>
        ) : null}
        {examples
          .map((example, exampleName) => {
            return (
              <option
                key={exampleName} // for React
                data-key={exampleName} // for _onSelectChange
                value={example.get("value")} // for matching to select's `value`
              >
                {example.get("summary") || exampleName}
              </option>
            )
          })
          .valueSeq()}
      </select>
    )
  }
}
