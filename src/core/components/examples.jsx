import React from "react"
import PropTypes from "prop-types"

export default class Examples extends React.Component {
    static propTypes = {
        getComponent: PropTypes.func.isRequired,
        examples: PropTypes.any
    }

    render() {
        let {
            getComponent,
            examples
        } = this.props

        const HighlightCode = getComponent("highlightCode")

        if (!examples || !examples.size) {
            return null
        }

        return examples.entrySeq().map(([key, example]) => {
            let exampleValue = example
            if (example.toJS) {
                try {
                    exampleValue = JSON.stringify(example.toJS(), null, 2)
                }
                catch (e) {
                    exampleValue = String(example)
                }
            }

            return (<div key={key}>
                <h5>{key}</h5>
                <HighlightCode className="example" value={exampleValue} />
            </div>)
        }).toArray()
    }
}