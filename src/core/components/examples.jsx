/**
 * @prettier
 */
import React from "react"
import { Map } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

import Example from "./example"
import ExamplesSelect from "./examples-select"

export default class Examples extends React.PureComponent {
  static propTypes = {
    examples: ImPropTypes.map,
    currentExampleKey: PropTypes.string,
    onSelect: PropTypes.func,
    getComponent: PropTypes.func.isRequired,
    showTitle: PropTypes.bool,
    omitControls: PropTypes.bool,
    omitValue: PropTypes.bool,
  }

  static defaultProps = {
    showTitle: true,
  }

  _onSelect = (key, { isSyntheticChange = false } = {}) => {
    if (typeof this.props.onSelect === "function") {
      this.props.onSelect(key, {
        isSyntheticChange,
      })
    }
  }

  getCurrentExample = () => {
    const { examples, currentExampleKey } = this.props

    const currentExamplePerProps = examples.get(currentExampleKey)

    const firstExamplesKey = examples.keySeq().first()
    const firstExample = examples.get(firstExamplesKey)

    return currentExamplePerProps || firstExample || Map({})
  }

  componentDidMount() {
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
      getComponent,
      showTitle,
      omitControls,
      omitValue,
    } = this.props

    const currentExample = this.getCurrentExample()

    return (
      <div className="examples">
        {showTitle ? <div className="examples__title">Examples</div> : null}
        {!omitControls ? (
          <ExamplesSelect
            examples={examples}
            currentExampleKey={currentExampleKey}
            onSelect={this._onSelect}
          />
        ) : null}
        <Example
          example={currentExample}
          omitValue={omitValue}
          getComponent={getComponent}
        />
      </div>
    )
  }
}
