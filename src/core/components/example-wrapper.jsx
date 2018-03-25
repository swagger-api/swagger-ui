import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import { getModelNameFromRef } from "core/utils"

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

        if (examples && examples.size) {
            const Examples = getComponent("Examples")
            return <Examples getComponent={getComponent} examples={examples} />
        }

        const Example = getComponent("Example")
        let { isOAS3 } = specSelectors
        schema = schema.toJS()

        let anyOf, oneOf
        if (isOAS3()) {
            oneOf = schema.oneOf
            anyOf = schema.anyOf
        }

        const getMultipleExamples = (title, attribute) => {
            const getModelName = (schema) => {
                let $$ref = schema && schema.$$ref
                return $$ref ? getModelNameFromRef($$ref) : null
            }

            return (
                <div>
                    <div className="small">{title}</div>
                    {
                        attribute.map((subschema, key) =>
                            <div key={key}>
                                <h5>{getModelName(subschema)}</h5>
                                <Example
                                    getComponent={getComponent}
                                    specSelectors={specSelectors}
                                    schema={subschema}
                                    examples={examples}
                                    contentType={contentType}
                                    oas3SchemaForContentType={fromJS(subschema)}
                                    responseContentType={responseContentType} />
                            </div>)
                    }
                </div>
            )
        }

        const getExample = () => {
            if (!schema)
                return null

            if (anyOf) {
                return getMultipleExamples("anyOf:", anyOf)
            }
            else if (oneOf) {
                return getMultipleExamples("oneOf:", oneOf)
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

        return (<div className="example-box">{getExample()}</div>)
    }
}
