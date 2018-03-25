import React from "react"
import PropTypes from "prop-types"
import { getSampleSchema } from "core/utils"

const getExampleComponent = (sampleResponse, HighlightCode) => {
    if (!sampleResponse)
        return null

    return <div>
        <HighlightCode className="example" value={sampleResponse} />
    </div>
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

        if (examples && examples.size) {
            const Examples = getComponent("Examples")
            return <Examples getComponent={getComponent} examples={examples} />
        }

        const HighlightCode = getComponent("highlightCode")
        let { isOAS3 } = specSelectors

        let sampleResponse
        if (isOAS3()) {
            sampleResponse = getSampleSchema(oas3SchemaForContentType ? oas3SchemaForContentType.toJS() : null,
                responseContentType,
                {
                    includeReadOnly: true
                })
        }
        else {
            sampleResponse = getSampleSchema(schema, contentType,
                {
                    includeReadOnly: true,
                    includeWriteOnly: true // writeOnly has no filtering effect in swagger 2.0
                })
        }

        return getExampleComponent(sampleResponse, HighlightCode)
    }

}
