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

  getCurrentExample = () => {
    const { examples, currentKey } = this.props

    const currentExamplePerProps = examples.get(currentKey)

    const firstExamplesKey = examples.keySeq().first()
    const firstExample = examples.get(firstExamplesKey)

    return currentExamplePerProps || firstExample || Map({})
  }


  componentDidMount() {
    // this is the not-so-great part of ExamplesSelect... here we're
    // artificially kicking off an onSelect event in order to set a default
    // value in state. the consumer has the option to avoid this by checking
    // `isSyntheticEvent`, but we should really be doing this in a selector.
    // TODO: clean this up
    // FIXME: should this only trigger if `currentExamplesKey` is nullish?
    const { onSelect, examples } = this.props

    if (typeof onSelect === "function") {
      const firstExample = this.getCurrentExample()
      const firstExampleKey = examples.keyOf(firstExample)

      this._onSelect(firstExampleKey, {
        isSyntheticChange: true,
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
        className="examples-control"
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
