import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"

export default class ExampleWrapper extends React.Component {
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
        const Examples = getComponent("Examples")
        const Example = getComponent("Example")

        if (examples && examples.size) {
            return <Examples getComponent={getComponent} examples={examples} />
        }

        schema = schema.toJS()

        var anyOf, oneOf
        if (isOAS3()) {
            oneOf = schema.oneOf
            anyOf = schema.anyOf
        }

        if (schema) {
            if (anyOf) {
                return (
                    <div>
                        <div>{ "anyOf ->" }</div>
                        {anyOf.map((i, k) => <div key={k}><Example
                            getComponent={getComponent}
                            specSelectors={specSelectors}
                            schema={i}
                            examples={examples}
                            contentType={contentType}
                            oas3SchemaForContentType={fromJS(i)}
                            responseContentType={responseContentType} /></div>)}
                    </div>
                )
            }
            else if (oneOf) {
                return (
                    <div>
                        <div>{ "oneOf ->" }</div>
                        {oneOf.map((i, k) => <div key={k}><Example
                            getComponent={getComponent}
                            specSelectors={specSelectors}
                            schema={i}
                            examples={examples}
                            contentType={contentType}
                            oas3SchemaForContentType={fromJS(i)}
                            responseContentType={responseContentType} /></div>)}
                    </div>
                )
            }
            else {
                return <Example
                    getComponent={getComponent}
                    specSelectors={specSelectors}
                    schema={schema}
                    examples={examples}
                    contentType={contentType}
                    oas3SchemaForContentType={oas3SchemaForContentType}
                    responseContentType={responseContentType} />
            }
        }
    }
}
