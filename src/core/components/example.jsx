import React from "react"
import PropTypes from "prop-types"
import { getSampleSchema } from "core/utils"

const getExampleComponent = (sampleResponse, examples, HighlightCode) => {
    if (examples && examples.size) {
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

    if (sampleResponse) {
        return <div>
            <HighlightCode className="example" value={sampleResponse} />
        </div>
    }
    return null
}

export default class Example extends React.Component {
    static propTypes = {
        getComponent: PropTypes.func.isRequired,
        specSelectors: PropTypes.object.isRequired,
        schema: PropTypes.object.isRequired,
        examples: PropTypes.any,
        contentType: PropTypes.string,
        oas3SchemaForContentType: PropTypes.any,
        responseContentType: PropTypes.string,
    }

    render() {
        let {
            getComponent,
            specSelectors,
            schema,
            examples,
            contentType,
            oas3SchemaForContentType,
            responseContentType,
        } = this.props

        let { isOAS3 } = specSelectors
        const HighlightCode = getComponent("highlightCode")

        var _schema, _contentType, sampleSchemaOptions
        if (isOAS3()) {
            _schema = oas3SchemaForContentType ? oas3SchemaForContentType.toJS() : null
            _contentType = responseContentType
            sampleSchemaOptions = {
                includeReadOnly: true
            }
        }
        else {
            _schema = schema
            _contentType = contentType
            sampleSchemaOptions = {
                includeReadOnly: true,
                includeWriteOnly: true // writeOnly has no filtering effect in swagger 2.0
            }
        }

        const anyOf = isOAS3() ? schema.items.anyOf : null
        const oneOf = isOAS3() ? schema.items.oneOf : null

        let sampleResponse
        if (anyOf) {
            sampleResponse = _schema ? getSampleSchema(_schema, _contentType, sampleSchemaOptions) : null
            sampleResponse = sampleResponse ? "anyOf ->\n" + sampleResponse : null
        }
        else if (oneOf) {
            sampleResponse = _schema ? getSampleSchema(_schema, _contentType, sampleSchemaOptions) : null
            sampleResponse = sampleResponse ? "oneOf ->\n" + sampleResponse : null
        }
        else {
            sampleResponse = _schema ? getSampleSchema(_schema, _contentType, sampleSchemaOptions) : null            
        }
        let example = getExampleComponent(sampleResponse, examples, HighlightCode)
        return example
    }

}
