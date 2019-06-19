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
    currentExampleKey: null,
    selectMessage: "Select an example...",
  }

  _onSelectChange = e => {
    if (typeof this.props.onSelect === "function") {
      const element = e.target.selectedOptions[0]
      const key = element.getAttribute("value")
      this.props.onSelect(key)
    }
  }

  render() {
    const { examples, currentExampleKey, selectMessage } = this.props

    const isCurrentKeyAnExample = examples.has(currentExampleKey)

    return (
      <select onChange={this._onSelectChange} value={currentExampleKey}>
        {!isCurrentKeyAnExample ? (
          <option selected>{selectMessage}</option>
        ) : null}
        {examples
          .map((example, exampleName) => {
            return (
              <option
                key={exampleName} // for React
                data-key={exampleName} // for _onSelectChange
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
