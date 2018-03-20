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

        let { isOAS3 } = specSelectors
        const HighlightCode = getComponent("highlightCode")
        const Examples = getComponent("Examples")

        if (examples && examples.size) {
            return <Examples getComponent={ getComponent } examples={ examples }/>
        }

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

        var sampleResponse = getSampleSchema(_schema, _contentType, sampleSchemaOptions)
        return getExampleComponent(sampleResponse, HighlightCode)
    }

}
