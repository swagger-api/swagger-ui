/**
 * @prettier
 */
import React from "react"
import { Map } from "immutable"
import { stringify } from "core/utils"

import Example from "./example"
import ExamplesSelect from "./examples-select"

export default class Examples extends React.PureComponent {
  static defaultProps = {
    showTitle: true,
  }
  constructor() {
    super()

    this.state = {
      activeExamplesKey: null,
    }
  }

  _onSelect = (v, key) => {
    this.setState({
      activeExamplesKey: key,
    })

    if (typeof this.props.onSelect === "function") {
      this.props.onSelect(v, key)
    }
  }

  getCurrentExample = () => {
    const { examples, defaultToFirstExample } = this.props

    const currentExample = examples.get(this.state.activeExamplesKey)

    if (!defaultToFirstExample) {
      return currentExample || Map({})
    }

    const firstExamplesKey = examples.keySeq().first()
    const firstExample = examples.get(firstExamplesKey)
    return currentExample || firstExample || Map({})
  }

  componentDidMount() {
    const { onSelect, examples, defaultToFirstExample } = this.props
    if (defaultToFirstExample) {
      if (typeof onSelect === "function") {
        const firstExample = this.getCurrentExample()
        const firstExampleKey = examples.keyOf(firstExample)
        this.props.onSelect(
          stringify(firstExample.get("value")),
          firstExampleKey
        )
      }
    }
  }
  render() {
    const {
      examples,
      getComponent,
      showTitle,
      omitControls,
      omitValue,
    } = this.props

    const Markdown = getComponent("Markdown")
    const HighlightCode = getComponent("highlightCode")

    const currentExample = this.getCurrentExample()

    return (
      <div className="examples">
        {showTitle ? <div className="examples__title">Examples</div> : null}
        {!omitControls ? (
          <ExamplesSelect
            examples={examples}
            currentValue={currentExample.get("value")}
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
