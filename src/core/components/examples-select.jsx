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
    currentExampleKey: PropTypes.string,
    isModifiedValueAvailable: PropTypes.bool,
    isValueModified: PropTypes.bool,
  }

  static defaultProps = {
    examples: Im.Map({}),
    onSelect: (...args) =>
      console.log(
        // FIXME: remove before merging to master...
        `DEBUG: ExamplesSelect was not given an onSelect callback`,
        ...args
      ),
    currentExampleKey: null,
  }

  _onSelect = (key, { isSyntheticChange = false } = {}) => {
    if (typeof this.props.onSelect === "function") {
      this.props.onSelect(key, {
        isSyntheticChange,
      })
    }
  }

  _onDomSelect = e => {
    if (typeof this.props.onSelect === "function") {
      const element = e.target.selectedOptions[0]
      const key = element.getAttribute("value")

      this._onSelect(key, {
        isSyntheticChange: false,
      })
    }
  }

  render() {
    const {
      examples,
      currentExampleKey,
      isValueModified,
      isModifiedValueAvailable,
    } = this.props

    return (
      <select
        onChange={this._onDomSelect}
        value={
          isModifiedValueAvailable && isValueModified
            ? "__MODIFIED__VALUE__"
            : currentExampleKey
        }
      >
        {isModifiedValueAvailable ? (
          <option value="__MODIFIED__VALUE__">[Modified value]</option>
        ) : null}
        {examples
          .map((example, exampleName) => {
            return (
              <option
                key={exampleName} // for React
                value={exampleName} // for matching to select's `value`
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
