// This component provides an interface that feels like an uncontrolled input
// to consumers, while providing a `defaultValue` interface that initializes
// the input's value using JavaScript value property APIs instead of React's 
// vanilla[0] implementation that uses HTML value attributes.
//
// This is useful in situations where we don't want to surface an input's value
// into the HTML/CSS-exposed side of the DOM, for example to avoid sequential
// input chaining attacks[1].
// 
// [0]: https://github.com/facebook/react/blob/baff5cc2f69d30589a5dc65b089e47765437294b/fixtures/dom/src/components/fixtures/text-inputs/README.md
// [1]: https://github.com/d0nutptr/sic

import React from "react"
import PropTypes from "prop-types"

export default class InitializedInput extends React.Component {
  componentDidMount() {
    // Set the element's `value` property (*not* the `value` attribute)
    // once, on mount, if an `initialValue` is provided.
    if(this.props.initialValue) {
      this.inputRef.value = this.props.initialValue
    }
  }

  render() {
    // Filter out `value` and `defaultValue`, since we have our own
    // `initialValue` interface that we provide.
    // eslint-disable-next-line no-unused-vars, react/prop-types
    const { value, defaultValue, initialValue, ...otherProps } = this.props
    return <input {...otherProps} ref={c => this.inputRef = c} />
  }
}

InitializedInput.propTypes = {
  initialValue: PropTypes.string
}
