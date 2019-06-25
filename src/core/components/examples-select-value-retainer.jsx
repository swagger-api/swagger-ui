/**
 * @prettier
 */
import React from "react"
import { Map } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

import ExamplesSelect from "./examples-select"

// This stateful component lets us avoid writing competing values (user
// modifications vs example values) into global state, and the mess that comes
// with that: tracking which of the two values are currently used for
// Try-It-Out, which example a modified value came from, etc...
//
// The solution here is to retain the last user-modified value in
// ExamplesSelectValueRetainer's component state, so that our global state can stay
// clean, always simply being the source of truth for what value should be both
// displayed to the user and used as a value during request execution.
//
// This approach/tradeoff was chosen in order to encapsulate the particular
// logic of Examples within the Examples component tree, and to avoid
// regressions within our current implementation elsewhere (non-Examples
// definitions, OpenAPI 2.0, etc). A future refactor to global state might make
// this component unnecessary.
//
// TL;DR: this is not our usual approach, but the choice was made consciously.

// Note that `currentNamespace` isn't currently used anywhere!

export default class ExamplesSelectValueRetainer extends React.PureComponent {
  static propTypes = {
    examples: ImPropTypes.map,
    onSelect: PropTypes.func,
    updateValue: PropTypes.func, // mechanism to update upstream value
    getComponent: PropTypes.func.isRequired,
    currentUserInputValue: PropTypes.any,
    currentKey: PropTypes.string,
    currentNamespace: PropTypes.string,
    // (also proxies props for Examples)
  }

  static defaultProps = {
    examples: Map({}),
    currentNamespace: "__DEFAULT__NAMESPACE__",
    onSelect: (...args) =>
      console.log(
        "ExamplesSelectValueRetainer: no `onSelect` function was provided",
        ...args
      ),
    updateValue: (...args) =>
      console.log(
        "ExamplesSelectValueRetainer: no `updateValue` function was provided",
        ...args
      ),
  }

  constructor(props) {
    super(props)

    const valueFromExample = this._getCurrentExampleValue()

    this.state = {
      // user edited: last value that came from the world around us, and didn't
      // match the current example's value
      // internal: last value that came from user selecting an Example
      [props.currentNamespace]: Map({
        lastUserEditedValue: this.props.currentUserInputValue,
        lastDownstreamValue: valueFromExample,
        isModifiedValueSelected:
          // valueFromExample !== undefined &&
          this.props.currentUserInputValue !== valueFromExample,
      }),
    }
  }

  _getStateForCurrentNamespace = () => {
    const { currentNamespace } = this.props

    return (this.state[currentNamespace] || Map()).toJS()
  }

  _setStateForCurrentNamespace = obj => {
    const { currentNamespace } = this.props

    return this._setStateForNamespace(currentNamespace, obj)
  }

  _setStateForNamespace = (namespace, obj) => {
    return this.setState({
      [namespace]: (this.state[namespace] || Map()).merge(obj),
    })
  }

  _isCurrentUserInputSameAsExampleValue = () => {
    const { currentUserInputValue } = this.props

    const valueFromExample = this._getCurrentExampleValue()

    return valueFromExample === currentUserInputValue
  }

  _getValueForExample = (exampleKey, props) => {
    // props are accepted so that this can be used in componentWillReceiveProps,
    // which has access to `nextProps`
    const { examples } = props || this.props
    return (examples || Map({})).getIn([exampleKey, "value"])
  }

  _getCurrentExampleValue = props => {
    // props are accepted so that this can be used in componentWillReceiveProps,
    // which has access to `nextProps`
    const { currentKey } = props || this.props
    return this._getValueForExample(currentKey, props || this.props)
  }

  _onExamplesSelect = (key, { isSyntheticChange } = {}, ...otherArgs) => {
    const { onSelect, updateValue, currentUserInputValue } = this.props
    const { lastUserEditedValue } = this._getStateForCurrentNamespace()

    const valueFromExample = this._getValueForExample(key)

    if (key === "__MODIFIED__VALUE__") {
      updateValue(lastUserEditedValue)
      return this._setStateForCurrentNamespace({
        isModifiedValueSelected: true,
      })
    }

    if (typeof onSelect === "function") {
      onSelect(key, { isSyntheticChange }, ...otherArgs)
    }

    this._setStateForCurrentNamespace({
      lastDownstreamValue: valueFromExample,
      isModifiedValueSelected:
        isSyntheticChange &&
        !!currentUserInputValue &&
        currentUserInputValue !== valueFromExample,
    })

    // we never want to send up value updates from synthetic changes
    if (isSyntheticChange) return

    if (typeof updateValue === "function") {
      updateValue(valueFromExample)
    }
  }

  componentWillReceiveProps(nextProps) {
    // update `lastUserEditedValue` as new currentUserInput values come in

    const { currentUserInputValue: newValue } = nextProps

    const {
      lastUserEditedValue,
      lastDownstreamValue,
    } = this._getStateForCurrentNamespace()

    const valueFromExample = this._getValueForExample(
      nextProps.currentKey,
      nextProps
    )

    if (
      newValue !== this.props.currentUserInputValue && // value has changed
      newValue !== lastUserEditedValue && // value isn't already tracked
      newValue !== lastDownstreamValue && // value isn't what we've seen on the other side
      newValue !== valueFromExample // value isn't the example's value
    ) {
      this._setStateForNamespace(nextProps.currentNamespace, {
        lastUserEditedValue: nextProps.currentUserInputValue,
        isModifiedValueSelected: newValue !== valueFromExample,
      })
    }
  }

  render() {
    const { currentUserInputValue, examples, currentKey } = this.props
    const {
      lastDownstreamValue,
      lastUserEditedValue,
      isModifiedValueSelected,
    } = this._getStateForCurrentNamespace()

    return (
      <div>
        <ExamplesSelect
          examples={examples}
          currentExampleKey={currentKey}
          onSelect={this._onExamplesSelect}
          isModifiedValueAvailable={
            !!lastUserEditedValue && lastUserEditedValue !== lastDownstreamValue
          }
          isValueModified={
            currentUserInputValue !== undefined && isModifiedValueSelected
          }
        />
      </div>
    )
  }
}
