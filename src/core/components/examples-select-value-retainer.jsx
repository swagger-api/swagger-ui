/**
 * @prettier
 */
import React from "react"
import { Map, List } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

import { stringify } from "core/utils"

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

const stringifyUnlessList = (input) =>
  List.isList(input) ? input : stringify(input)

export default class ExamplesSelectValueRetainer extends React.PureComponent {
  static propTypes = {
    examples: ImPropTypes.map,
    onSelect: PropTypes.func,
    updateValue: PropTypes.func, // mechanism to update upstream value
    userHasEditedBody: PropTypes.bool,
    getComponent: PropTypes.func.isRequired,
    currentUserInputValue: PropTypes.any,
    currentKey: PropTypes.string,
    currentNamespace: PropTypes.string,
    setRetainRequestBodyValueFlag: PropTypes.func.isRequired,
    // (also proxies props for Examples)
  }

  static defaultProps = {
    userHasEditedBody: false,
    examples: Map({}),
    currentNamespace: "__DEFAULT__NAMESPACE__",
    setRetainRequestBodyValueFlag: () => {
      // NOOP
    },
    onSelect: (...args) =>
      // eslint-disable-next-line no-console
      console.log(
        "ExamplesSelectValueRetainer: no `onSelect` function was provided",
        ...args
      ),
    updateValue: (...args) =>
      // eslint-disable-next-line no-console
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
          this.props.userHasEditedBody ||
          this.props.currentUserInputValue !== valueFromExample,
      }),
    }
  }

  componentWillUnmount() {
    this.props.setRetainRequestBodyValueFlag(false)
  }

  _getStateForCurrentNamespace = () => {
    const { currentNamespace } = this.props

    return (this.state[currentNamespace] || Map()).toObject()
  }

  _setStateForCurrentNamespace = (obj) => {
    const { currentNamespace } = this.props

    return this._setStateForNamespace(currentNamespace, obj)
  }

  _setStateForNamespace = (namespace, obj) => {
    const oldStateForNamespace = this.state[namespace] || Map()
    const newStateForNamespace = oldStateForNamespace.mergeDeep(obj)
    return this.setState({
      [namespace]: newStateForNamespace,
    })
  }

  _isCurrentUserInputSameAsExampleValue = () => {
    const { currentUserInputValue } = this.props

    const valueFromExample = this._getCurrentExampleValue()

    return valueFromExample === currentUserInputValue
  }

  _getValueForExample = (exampleKey, props) => {
    // props are accepted so that this can be used in UNSAFE_componentWillReceiveProps,
    // which has access to `nextProps`
    const { examples } = props || this.props
    return stringifyUnlessList(
      (examples || Map({})).getIn([exampleKey, "value"])
    )
  }

  _getCurrentExampleValue = (props) => {
    // props are accepted so that this can be used in UNSAFE_componentWillReceiveProps,
    // which has access to `nextProps`
    const { currentKey } = props || this.props
    return this._getValueForExample(currentKey, props || this.props)
  }

  _onExamplesSelect = (key, { isSyntheticChange } = {}, ...otherArgs) => {
    const { onSelect, updateValue, currentUserInputValue, userHasEditedBody } =
      this.props
    const { lastUserEditedValue } = this._getStateForCurrentNamespace()

    const valueFromExample = this._getValueForExample(key)

    if (key === "__MODIFIED__VALUE__") {
      updateValue(stringifyUnlessList(lastUserEditedValue))
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
        (isSyntheticChange && userHasEditedBody) ||
        (!!currentUserInputValue && currentUserInputValue !== valueFromExample),
    })

    // we never want to send up value updates from synthetic changes
    if (isSyntheticChange) return

    if (typeof updateValue === "function") {
      updateValue(stringifyUnlessList(valueFromExample))
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // update `lastUserEditedValue` as new currentUserInput values come in

    const {
      currentUserInputValue: newValue,
      examples,
      onSelect,
      userHasEditedBody,
    } = nextProps

    const { lastUserEditedValue, lastDownstreamValue } =
      this._getStateForCurrentNamespace()

    const valueFromCurrentExample = this._getValueForExample(
      nextProps.currentKey,
      nextProps
    )

    const examplesMatchingNewValue = examples.filter(
      (example) =>
        example.get("value") === newValue ||
        // sometimes data is stored as a string (e.g. in Request Bodies), so
        // let's check against a stringified version of our example too
        stringify(example.get("value")) === newValue
    )

    if (examplesMatchingNewValue.size) {
      let key
      if (examplesMatchingNewValue.has(nextProps.currentKey)) {
        key = nextProps.currentKey
      } else {
        key = examplesMatchingNewValue.keySeq().first()
      }
      onSelect(key, {
        isSyntheticChange: true,
      })
    } else if (
      newValue !== this.props.currentUserInputValue && // value has changed
      newValue !== lastUserEditedValue && // value isn't already tracked
      newValue !== lastDownstreamValue // value isn't what we've seen on the other side
    ) {
      this.props.setRetainRequestBodyValueFlag(true)
      this._setStateForNamespace(nextProps.currentNamespace, {
        lastUserEditedValue: nextProps.currentUserInputValue,
        isModifiedValueSelected:
          userHasEditedBody || newValue !== valueFromCurrentExample,
      })
    }
  }

  render() {
    const {
      currentUserInputValue,
      examples,
      currentKey,
      getComponent,
      userHasEditedBody,
    } = this.props
    const {
      lastDownstreamValue,
      lastUserEditedValue,
      isModifiedValueSelected,
    } = this._getStateForCurrentNamespace()

    const ExamplesSelect = getComponent("ExamplesSelect")

    return (
      <ExamplesSelect
        examples={examples}
        currentExampleKey={currentKey}
        onSelect={this._onExamplesSelect}
        isModifiedValueAvailable={
          !!lastUserEditedValue && lastUserEditedValue !== lastDownstreamValue
        }
        isValueModified={
          (currentUserInputValue !== undefined &&
            isModifiedValueSelected &&
            currentUserInputValue !== this._getCurrentExampleValue()) ||
          userHasEditedBody
        }
      />
    )
  }
}
